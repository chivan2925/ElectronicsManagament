package org.example.electronics.service.user;

import org.example.electronics.dto.request.user.cart.CartItemQuantityRequestDTO;
import org.example.electronics.dto.request.user.cart.CartItemRequestDTO;
import org.example.electronics.dto.request.user.cart.CartSyncRequestDTO;
import org.example.electronics.dto.response.user.cart.CartResponseDTO;

public interface UserCartService {

    CartResponseDTO getCart(Integer userId);

    CartResponseDTO replaceCart(Integer userId, CartSyncRequestDTO requestDTO);

    CartResponseDTO addItem(Integer userId, CartItemRequestDTO requestDTO);

    CartResponseDTO updateItem(Integer userId, Integer variantId, CartItemQuantityRequestDTO requestDTO);

    CartResponseDTO removeItem(Integer userId, Integer variantId);

    CartResponseDTO clearCart(Integer userId);
}
