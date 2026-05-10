package org.example.electronics.service.user.impl;

import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;
import org.example.electronics.dto.request.user.cart.CartItemQuantityRequestDTO;
import org.example.electronics.dto.request.user.cart.CartItemRequestDTO;
import org.example.electronics.dto.request.user.cart.CartSyncRequestDTO;
import org.example.electronics.dto.response.user.cart.CartItemResponseDTO;
import org.example.electronics.dto.response.user.cart.CartResponseDTO;
import org.example.electronics.entity.MediaEntity;
import org.example.electronics.entity.ProductEntity;
import org.example.electronics.entity.UserEntity;
import org.example.electronics.entity.VariantEntity;
import org.example.electronics.entity.cart.CartEntity;
import org.example.electronics.entity.cart.CartItemEntity;
import org.example.electronics.entity.enums.ProductStatus;
import org.example.electronics.entity.enums.UserStatus;
import org.example.electronics.repository.CartRepository;
import org.example.electronics.repository.UserRepository;
import org.example.electronics.repository.VariantRepository;
import org.example.electronics.service.user.UserCartService;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.util.StringUtils;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.Comparator;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.Set;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class UserCartServiceImpl implements UserCartService {

    private static final int MAX_CART_QUANTITY = 99;

    private final CartRepository cartRepository;
    private final UserRepository userRepository;
    private final VariantRepository variantRepository;

    @Transactional
    @Override
    public CartResponseDTO getCart(Integer userId) {
        return toResponse(getOrCreateCart(userId));
    }

    @Transactional
    @Override
    public CartResponseDTO replaceCart(Integer userId, CartSyncRequestDTO requestDTO) {
        CartEntity cart = getOrCreateCart(userId);
        Map<Integer, CartItemEntity> existingItems = getCartItemsByVariantId(cart);
        Map<Integer, Integer> requestedQuantities = aggregateItems(requestDTO == null ? null : requestDTO.items());
        Set<Integer> acceptedVariantIds = requestedQuantities.entrySet().stream()
                .map((entry) -> applySyncItem(cart, existingItems, entry.getKey(), entry.getValue()))
                .flatMap(Optional::stream)
                .collect(Collectors.toSet());

        cart.getItems().removeIf((item) -> !acceptedVariantIds.contains(item.getVariant().getId()));

        return toResponse(cartRepository.save(cart));
    }

    @Transactional
    @Override
    public CartResponseDTO addItem(Integer userId, CartItemRequestDTO requestDTO) {
        CartEntity cart = getOrCreateCart(userId);
        VariantEntity variant = getPurchasableVariant(requestDTO.variantId());
        Map<Integer, CartItemEntity> existingItems = getCartItemsByVariantId(cart);
        CartItemEntity existingItem = existingItems.get(variant.getId());
        int requestedQuantity = normalizeRequestedQuantity(requestDTO.quantity());

        if (existingItem == null) {
            cart.addItem(CartItemEntity.builder()
                    .quantity(clampQuantityForVariant(requestedQuantity, variant))
                    .variant(variant)
                    .build());
        } else {
            existingItem.setQuantity(clampQuantityForVariant(existingItem.getQuantity() + requestedQuantity, variant));
        }

        return toResponse(cartRepository.save(cart));
    }

    @Transactional
    @Override
    public CartResponseDTO updateItem(Integer userId, Integer variantId, CartItemQuantityRequestDTO requestDTO) {
        CartEntity cart = getOrCreateCart(userId);
        VariantEntity variant = getPurchasableVariant(variantId);
        CartItemEntity item = getCartItemsByVariantId(cart).get(variant.getId());

        if (item == null) {
            throw new EntityNotFoundException("Không tìm thấy sản phẩm trong giỏ hàng với variant id: " + variantId);
        }

        item.setQuantity(clampQuantityForVariant(requestDTO.quantity(), variant));

        return toResponse(cartRepository.save(cart));
    }

    @Transactional
    @Override
    public CartResponseDTO removeItem(Integer userId, Integer variantId) {
        CartEntity cart = getOrCreateCart(userId);

        cart.getItems().removeIf((item) -> item.getVariant().getId().equals(variantId));

        return toResponse(cartRepository.save(cart));
    }

    @Transactional
    @Override
    public CartResponseDTO clearCart(Integer userId) {
        CartEntity cart = getOrCreateCart(userId);

        cart.getItems().clear();

        return toResponse(cartRepository.save(cart));
    }

    private CartEntity getOrCreateCart(Integer userId) {
        assertActiveUser(userId);

        return cartRepository.findByUserIdWithItems(userId)
                .orElseGet(() -> cartRepository.save(CartEntity.builder()
                        .user(getActiveUser(userId))
                        .build()));
    }

    private UserEntity getActiveUser(Integer userId) {
        UserEntity user = userRepository.findById(userId)
                .orElseThrow(() -> new EntityNotFoundException("Không tìm thấy người dùng với id: " + userId));

        if (user.getStatus() != UserStatus.ACTIVE) {
            throw new IllegalStateException("Tài khoản không đủ điều kiện sử dụng giỏ hàng");
        }

        return user;
    }

    private void assertActiveUser(Integer userId) {
        getActiveUser(userId);
    }

    private Map<Integer, Integer> aggregateItems(List<CartItemRequestDTO> items) {
        Map<Integer, Integer> quantities = new LinkedHashMap<>();

        if (items == null) {
            return quantities;
        }

        for (CartItemRequestDTO item : items) {
            if (item == null || item.variantId() == null || item.quantity() == null) {
                continue;
            }

            quantities.merge(
                    item.variantId(),
                    normalizeRequestedQuantity(item.quantity()),
                    (currentQuantity, nextQuantity) -> Math.min(MAX_CART_QUANTITY, currentQuantity + nextQuantity)
            );
        }

        return quantities;
    }

    private Optional<Integer> applySyncItem(
            CartEntity cart,
            Map<Integer, CartItemEntity> existingItems,
            Integer variantId,
            Integer quantity
    ) {
        Optional<VariantEntity> variantOptional = variantRepository.findVariantWithBasicDetailsById(variantId)
                .filter(this::isPurchasable);

        if (variantOptional.isEmpty()) {
            return Optional.empty();
        }

        VariantEntity variant = variantOptional.get();
        CartItemEntity existingItem = existingItems.get(variant.getId());
        int resolvedQuantity = clampQuantityForVariant(quantity, variant);

        if (existingItem == null) {
            cart.addItem(CartItemEntity.builder()
                    .quantity(resolvedQuantity)
                    .variant(variant)
                    .build());
        } else {
            existingItem.setQuantity(resolvedQuantity);
        }

        return Optional.of(variant.getId());
    }

    private VariantEntity getPurchasableVariant(Integer variantId) {
        VariantEntity variant = variantRepository.findVariantWithBasicDetailsById(variantId)
                .orElseThrow(() -> new EntityNotFoundException("Không tìm thấy biến thể sản phẩm với id: " + variantId));

        if (!isPurchasable(variant)) {
            throw new IllegalStateException("Sản phẩm " + variant.getName() + " không đủ điều kiện thêm vào giỏ hàng");
        }

        return variant;
    }

    private boolean isPurchasable(VariantEntity variant) {
        ProductEntity product = variant.getProduct();

        return variant.getStatus() == ProductStatus.ACTIVE
                && product != null
                && product.getStatus() == ProductStatus.ACTIVE
                && getVariantStock(variant) > 0;
    }

    private Map<Integer, CartItemEntity> getCartItemsByVariantId(CartEntity cart) {
        return cart.getItems().stream()
                .collect(Collectors.toMap(
                        (item) -> item.getVariant().getId(),
                        (item) -> item,
                        (firstItem, secondItem) -> firstItem
                ));
    }

    private int normalizeRequestedQuantity(Integer quantity) {
        return Math.min(Math.max(quantity == null ? 1 : quantity, 1), MAX_CART_QUANTITY);
    }

    private int clampQuantityForVariant(Integer quantity, VariantEntity variant) {
        int maxQuantity = Math.min(MAX_CART_QUANTITY, getVariantStock(variant));

        return Math.min(normalizeRequestedQuantity(quantity), Math.max(maxQuantity, 1));
    }

    private int getVariantStock(VariantEntity variant) {
        return Math.max(variant.getTotalStock() == null ? 0 : variant.getTotalStock(), 0);
    }

    private CartResponseDTO toResponse(CartEntity cart) {
        List<CartItemResponseDTO> items = cart.getItems().stream()
                .sorted(Comparator.comparing(
                        CartItemEntity::getId,
                        Comparator.nullsLast(Integer::compareTo)
                ))
                .map(this::toItemResponse)
                .toList();
        int itemCount = items.stream()
                .mapToInt((item) -> item.quantity() == null ? 0 : item.quantity())
                .sum();
        BigDecimal subtotal = items.stream()
                .map((item) -> item.unitPrice().multiply(BigDecimal.valueOf(item.quantity())))
                .reduce(BigDecimal.ZERO, BigDecimal::add);

        return new CartResponseDTO(
                cart.getId(),
                cart.getUser().getId(),
                items,
                itemCount,
                subtotal,
                cart.getUpdatedAt()
        );
    }

    private CartItemResponseDTO toItemResponse(CartItemEntity item) {
        VariantEntity variant = item.getVariant();
        ProductEntity product = variant.getProduct();
        int maxQuantity = Math.min(MAX_CART_QUANTITY, getVariantStock(variant));

        return new CartItemResponseDTO(
                product.getId(),
                product.getName(),
                product.getSlug(),
                product.getBrand().getId(),
                product.getBrand().getName(),
                product.getCategory().getId(),
                product.getCategory().getName(),
                variant.getId(),
                variant.getName(),
                resolveImageUrl(variant),
                variant.getPrice() == null ? BigDecimal.ZERO : variant.getPrice(),
                Math.min(item.getQuantity(), Math.max(maxQuantity, 1)),
                maxQuantity,
                resolveItemStatus(variant),
                firstNonNull(item.getUpdatedAt(), item.getCreatedAt(), cartUpdatedAtFallback())
        );
    }

    private String resolveItemStatus(VariantEntity variant) {
        if (getVariantStock(variant) <= 0) {
            return "OUT_OF_STOCK";
        }

        ProductEntity product = variant.getProduct();

        if (product == null || product.getStatus() != ProductStatus.ACTIVE) {
            return "UNAVAILABLE";
        }

        return variant.getStatus() == null ? "UNAVAILABLE" : variant.getStatus().name();
    }

    private String resolveImageUrl(VariantEntity variant) {
        return findPrimaryMediaUrl(variant.getMedia())
                .or(() -> findPrimaryMediaUrl(variant.getProduct().getMedia()))
                .orElse(null);
    }

    private Optional<String> findPrimaryMediaUrl(Set<MediaEntity> mediaItems) {
        if (mediaItems == null || mediaItems.isEmpty()) {
            return Optional.empty();
        }

        return mediaItems.stream()
                .filter((media) -> StringUtils.hasText(media.getImageUrl()))
                .sorted(Comparator
                        .comparing((MediaEntity media) -> Boolean.TRUE.equals(media.getIsPrimary())).reversed()
                        .thenComparing((media) -> media.getDisplayOrder() == null ? 0 : media.getDisplayOrder())
                        .thenComparing((media) -> media.getId() == null ? 0 : media.getId()))
                .map(MediaEntity::getImageUrl)
                .findFirst();
    }

    @SafeVarargs
    private <T> T firstNonNull(T... values) {
        for (T value : values) {
            if (value != null) {
                return value;
            }
        }

        return null;
    }

    private LocalDateTime cartUpdatedAtFallback() {
        return LocalDateTime.now();
    }
}
