package com.seruca.entity;

import jakarta.persistence.*;
import lombok.*;
import java.util.List;

@Entity
@Table(name = "taxonomy_categories")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class TaxonomyCategory {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String name;

    @Column(columnDefinition = "TEXT")
    private String description;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "parent_id")
    private TaxonomyCategory parent;

    @OneToMany(mappedBy = "parent", cascade = CascadeType.ALL)
    private List<TaxonomyCategory> children;

    private Integer level;

    private String slug;
}
