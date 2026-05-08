package org.example.electronics.entity;

import jakarta.persistence.*;
import lombok.*;
import org.example.electronics.entity.enums.ProductStatus;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.JdbcTypeCode;
import org.hibernate.annotations.UpdateTimestamp;
import org.hibernate.type.SqlTypes;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.*;

@Entity
@Table(
        name = "variants",
        check = {
                @CheckConstraint(name = "chk_price_non_negative", constraint = "price >= 0"),
                @CheckConstraint(name = "chk_stock_non_negative", constraint = "stock >= 0")
        }
)
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
@EqualsAndHashCode(onlyExplicitlyIncluded = true)
public class VariantEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @EqualsAndHashCode.Include
    private Integer id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "product_id", nullable = false)
    private ProductEntity product;

    @OneToMany(mappedBy = "variant")
    @Builder.Default
    private Set<MediaEntity> media = new HashSet<>();

    @Column(nullable = false)
    private String name;

    @Column(nullable = false, unique = true)
    private String slug;

    @Column(length = 50)
    private String color;

    @JdbcTypeCode(SqlTypes.JSON)
    @Column(name = "specs_json", columnDefinition = "json")
    private Map<String, Object> specsJson;

    @Column(nullable = false, precision = 12, scale = 3)
    private BigDecimal price;

    @Column(name = "total_stock", nullable = false)
    private Integer totalStock;

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
