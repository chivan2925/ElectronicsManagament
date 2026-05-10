package org.example.electronics.controller.user;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.example.electronics.dto.response.admin.AdminReviewResponseDTO;
import org.example.electronics.dto.response.admin.product.AdminDetailProductResponseDTO;
import org.example.electronics.dto.response.admin.product.AdminProductResponseDTO;
import org.example.electronics.entity.enums.DateFilterType;
import org.example.electronics.entity.enums.ProductStatus;
import org.example.electronics.service.admin.AdminProductService;
import org.example.electronics.service.admin.AdminReviewService;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.data.web.PageableDefault;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.server.ResponseStatusException;

@RestController
@RequestMapping("/api/products")
@RequiredArgsConstructor
@Tag(
        name = "Storefront Product Catalog",
        description = "Public read-only product catalog endpoints for the customer storefront."
)
public class StorefrontProductController {

    private final AdminProductService adminProductService;
    private final AdminReviewService adminReviewService;

    @GetMapping
    @Operation(
            summary = "List active storefront products",
            description = "Returns ACTIVE products from the real database for customer-facing catalog and homepage sections."
    )
    public ResponseEntity<Page<AdminProductResponseDTO>> getActiveProducts(
            @RequestParam(required = false) String keyword,
            @RequestParam(required = false) Integer categoryId,
            @RequestParam(required = false) Integer brandId,
            @RequestParam(required = false) Boolean featured,
            @PageableDefault(sort = "updatedAt", direction = Sort.Direction.DESC) Pageable pageable
    ) {
        Page<AdminProductResponseDTO> products = adminProductService.getAllProducts(
                keyword,
                ProductStatus.ACTIVE,
                categoryId,
                brandId,
                featured,
                DateFilterType.CREATED_AT,
                null,
                null,
                pageable
        );

        return ResponseEntity.ok(products);
    }

    @GetMapping("/{productId}")
    @Operation(
            summary = "Get active storefront product detail",
            description = "Returns product detail only when the product is ACTIVE."
    )
    public ResponseEntity<AdminDetailProductResponseDTO> getActiveProductById(
            @PathVariable Integer productId
    ) {
        return ResponseEntity.ok(requireActiveProduct(productId));
    }

    @GetMapping("/{productId}/reviews")
    @Operation(
            summary = "List active storefront product reviews",
            description = "Returns reviews for an ACTIVE product in the customer storefront."
    )
    public ResponseEntity<Page<AdminReviewResponseDTO>> getActiveProductReviews(
            @PathVariable Integer productId,
            @RequestParam(required = false) String keyword,
            @PageableDefault(sort = "createdAt", direction = Sort.Direction.DESC) Pageable pageable
    ) {
        requireActiveProduct(productId);

        Page<AdminReviewResponseDTO> reviews = adminReviewService.getAllReviewsByProductId(
                productId,
                keyword,
                DateFilterType.CREATED_AT,
                null,
                null,
                pageable
        );

        return ResponseEntity.ok(reviews);
    }

    private AdminDetailProductResponseDTO requireActiveProduct(Integer productId) {
        AdminDetailProductResponseDTO product = adminProductService.getProductById(productId);

        if (product.status() != ProductStatus.ACTIVE) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Product not found.");
        }

        return product;
    }
}
