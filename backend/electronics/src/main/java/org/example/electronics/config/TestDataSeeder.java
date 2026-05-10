package org.example.electronics.config;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.example.electronics.entity.BrandEntity;
import org.example.electronics.entity.CategoryEntity;
import org.example.electronics.entity.MediaEntity;
import org.example.electronics.entity.ProductEntity;
import org.example.electronics.entity.VariantEntity;
import org.example.electronics.entity.warehouse.WarehouseDetailEntity;
import org.example.electronics.entity.warehouse.WarehouseEntity;
import org.example.electronics.repository.BrandRepository;
import org.example.electronics.repository.CategoryRepository;
import org.example.electronics.repository.MediaRepository;
import org.example.electronics.repository.ProductRepository;
import org.example.electronics.repository.VariantRepository;
import org.example.electronics.repository.WarehouseRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.util.List;
import java.util.Optional;

@Component
@RequiredArgsConstructor
@Slf4j
public class TestDataSeeder implements CommandLineRunner {

    private final ProductRepository productRepository;
    private final CategoryRepository categoryRepository;
    private final BrandRepository brandRepository;
    private final VariantRepository variantRepository;
    private final MediaRepository mediaRepository;
    private final WarehouseRepository warehouseRepository;

    @Override
    @Transactional
    public void run(String... args) throws Exception {
        seedCheapProduct("Sản phẩm Test 5K", "sp-test-5k", new BigDecimal("5000"), "Iphone15.jpg");
        seedCheapProduct("Sản phẩm Test 10K", "sp-test-10k", new BigDecimal("10000"), "bàn phím Razer BlackWidow V4.jpg");
    }

    private void seedCheapProduct(String name, String slug, BigDecimal price, String imageName) {
        if (productRepository.existsBySlug(slug)) {
            return;
        }

        try {
            CategoryEntity category = categoryRepository.findAll().stream().findFirst().orElse(null);
            BrandEntity brand = brandRepository.findAll().stream().findFirst().orElse(null);
            WarehouseEntity warehouse = warehouseRepository.findAll().stream().findFirst().orElse(null);

            if (category == null || brand == null || warehouse == null) return;

            ProductEntity product = ProductEntity.builder()
                    .name(name)
                    .slug(slug)
                    .category(category)
                    .brand(brand)
                    .description("Sản phẩm test giá rẻ để test VNPay/MoMo.")
                    .specsJson(java.util.Map.of("RAM", "8GB"))
                    .build();
            product = productRepository.save(product);

            MediaEntity productMedia = MediaEntity.builder()
                    .product(product)
                    .imageUrl("/images/products/" + imageName)
                    .publicId(slug + "-media-1")
                    .isPrimary(true)
                    .displayOrder(1)
                    .build();
            mediaRepository.save(productMedia);

            VariantEntity variant = VariantEntity.builder()
                    .product(product)
                    .sku(slug + "-VAR1")
                    .slug(slug + "-var1")
                    .name(name + " Mặc định")
                    .price(price)
                    .totalStock(100)
                    .specsJson(java.util.Map.of("Color", "Default"))
                    .build();
            variant = variantRepository.save(variant);

            MediaEntity variantMedia = MediaEntity.builder()
                    .variant(variant)
                    .imageUrl("/images/products/" + imageName)
                    .publicId(slug + "-media-2")
                    .isPrimary(true)
                    .displayOrder(1)
                    .build();
            mediaRepository.save(variantMedia);

            WarehouseDetailEntity stock = WarehouseDetailEntity.builder()
                    .warehouse(warehouse)
                    .variant(variant)
                    .quantity(100)
                    .build();
            warehouse.addWarehouseDetail(stock);
            warehouse.setCurrentStock(warehouse.getCurrentStock() + 100);
            warehouseRepository.save(warehouse);

            log.info("Seeded cheap product: {} with price {}", name, price);
        } catch (Exception e) {
            log.error("Failed to seed product {}: {}", name, e.getMessage());
        }
    }
}
