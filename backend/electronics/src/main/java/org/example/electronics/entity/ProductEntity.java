package org.example.electronics.entity;

import jakarta.persistence.*;
import lombok.*;
import org.example.electronics.entity.enums.ProductStatus;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.JdbcTypeCode;
import org.hibernate.annotations.UpdateTimestamp;
import org.hibernate.type.SqlTypes;

import java.time.LocalDateTime;
import java.util.*;

@Entity
@Table(
        name = "products",
        check = {
                @CheckConstraint(name = "chk_rating_star_range", constraint = "rating_star >= 0 AND rating_star <= 5"),
                @CheckConstraint(name = "chk_rating_count_non_negative", constraint = "rating_count >= 0"),
                @CheckConstraint(name = "chk_warranty_months_non_negative", constraint = "warranty_months >= 0")
        }
)
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ProductEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @Column(nullable = false)
    private String name;

    @Column(nullable = false, unique = true)
    private String slug;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "category_id", nullable = false)
    private CategoryEntity category;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "brand_id", nullable = false)
    private BrandEntity brand;

    @Column(columnDefinition = "TEXT")
    private String description;

    @JdbcTypeCode(SqlTypes.JSON)
    @Column(name = "specs_json", columnDefinition = "json")
    private Map<String, Object> specsJson;

    @Column(name = "rating_star", nullable = false)
    @Builder.Default
    private Float ratingStar = 0f;

    @Column(name = "rating_count", nullable = false)
    @Builder.Default
    private Integer ratingCount = 0;

    @Column(name = "warranty_months", nullable = false)
    @Builder.Default
    private Integer warrantyMonths = 0;

    @OneToMany(mappedBy = "product")
    @Builder.Default
    private Set<VariantEntity> variants = new HashSet<>();

    @OneToMany(mappedBy = "product")
    @Builder.Default
    private Set<MediaEntity> media = new HashSet<>();

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    @Builder.Default
    private ProductStatus status = ProductStatus.ACTIVE;

    @CreationTimestamp
    @Column(name = "created_at", updatable = false, nullable = false)
    private LocalDateTime createdAt;

    @UpdateTimestamp
    @Column(name = "updated_at", nullable = false)
    private LocalDateTime updatedAt;
}
