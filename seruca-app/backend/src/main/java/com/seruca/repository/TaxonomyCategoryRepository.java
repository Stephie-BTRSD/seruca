package com.seruca.repository;

import com.seruca.entity.TaxonomyCategory;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;
import java.util.Optional;

@Repository
public interface TaxonomyCategoryRepository extends JpaRepository<TaxonomyCategory, Long> {
    List<TaxonomyCategory> findByParentIsNull();
    List<TaxonomyCategory> findByParentId(Long parentId);
    Optional<TaxonomyCategory> findBySlug(String slug);
}
