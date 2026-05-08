package org.example.electronics.service.admin.impl;

import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;
import org.example.electronics.dto.request.admin.media.AdminAddMediaRequestDTO;
import org.example.electronics.dto.request.admin.media.AdminUpdateMediaOrderRequestDTO;
import org.example.electronics.dto.response.admin.AdminMediaResponseDTO;
import org.example.electronics.entity.MediaEntity;
import org.example.electronics.entity.ProductEntity;
import org.example.electronics.entity.VariantEntity;
import org.example.electronics.mapper.MediaMapper;
import org.example.electronics.repository.MediaRepository;
import org.example.electronics.repository.ProductRepository;
import org.example.electronics.repository.VariantRepository;
import org.example.electronics.service.admin.AdminMediaService;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class AdminMediaServiceImpl implements AdminMediaService {

    private final MediaMapper mediaMapper;
    private final MediaRepository mediaRepository;
    private final ProductRepository productRepository;
    private final VariantRepository variantRepository;

    @Transactional
    @Override
    public AdminMediaResponseDTO addMedia(AdminAddMediaRequestDTO adminAddMediaRequestDTO) {
        Integer productId = adminAddMediaRequestDTO.productId();
        Integer variantId = adminAddMediaRequestDTO.variantId();

        if (productId == null && variantId == null) {
            throw new IllegalArgumentException("Phải chọn sản phẩm hoặc biến thể để thêm media.");
        }

        if (productId != null && variantId != null) {
            throw new IllegalArgumentException("Một media không thể vừa là media của sản phẩm, vừa là media của biến thể.");
        }

        MediaEntity newMediaEntity = mediaMapper.toNewEntity(adminAddMediaRequestDTO);

        if (productId != null) {
            ProductEntity existingProductEntity = productRepository.findById(productId)
                    .orElseThrow(() -> new EntityNotFoundException(
                            "Không tìm thấy sản phẩm với id: " + productId
                    ));

            newMediaEntity.setProduct(existingProductEntity);
        }
        else {
            VariantEntity existingVariantEntity = variantRepository.findById(variantId)
                    .orElseThrow(() -> new EntityNotFoundException(
                            "Không tìm thấy biến thể với id: " + variantId
                    ));

            newMediaEntity.setVariant(existingVariantEntity);
        }

        newMediaEntity = mediaRepository.save(newMediaEntity);

        return mediaMapper.toAdminResponseDTO(newMediaEntity);
    }

    @Transactional
    @Override
    public void deleteMedia(Integer mediaId) {
        MediaEntity existingMediaEntity = mediaRepository.findById(mediaId)
                .orElseThrow(() -> new EntityNotFoundException(
                        "Không tìm thấy media với id: " + mediaId
                ));

        mediaRepository.delete(existingMediaEntity);
    }

    @Transactional
    @Override
    public void setPrimaryMedia(Integer mediaId) {
        MediaEntity existingMediaEntity = mediaRepository.findById(mediaId)
                .orElseThrow(() -> new EntityNotFoundException(
                        "Không tìm thấy media với id: " + mediaId
                ));

        if (existingMediaEntity.getProduct() != null) {
            mediaRepository.updateIsPrimaryToFalseByProductId(existingMediaEntity.getProduct().getId());
        }
        else if (existingMediaEntity.getVariant() != null) {
            mediaRepository.updateIsPrimaryToFalseByVariantId(existingMediaEntity.getVariant().getId());
        }
        else {
            throw new IllegalStateException("Media (ID: " + mediaId + ") không thuộc về bất kỳ sản phẩm hay biến thể nào!");
        }

        existingMediaEntity.setIsPrimary(true);
    }

    @Transactional
    @Override
    public AdminMediaResponseDTO updateMediaOrder(Integer mediaId, AdminUpdateMediaOrderRequestDTO adminUpdateMediaOrderRequestDTO) {
        MediaEntity existingMediaEntity = mediaRepository.findById(mediaId)
                .orElseThrow(() -> new EntityNotFoundException(
                        "Không tìm thấy media với id: " + mediaId
                ));

        existingMediaEntity.setDisplayOrder(adminUpdateMediaOrderRequestDTO.displayOrder());

        return mediaMapper.toAdminResponseDTO(existingMediaEntity);
    }
}
