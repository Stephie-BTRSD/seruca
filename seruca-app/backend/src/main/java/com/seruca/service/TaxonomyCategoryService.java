package com.seruca.service;

import com.seruca.entity.TaxonomyCategory;
import com.seruca.repository.TaxonomyCategoryRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.util.List;

@Service
public class TaxonomyCategoryService {

    @Autowired
    private TaxonomyCategoryRepository taxonomyRepository;

    /**
     * Retrieves all top-level root categories.
     */
    @Transactional(readOnly = true)
    public List<TaxonomyCategory> getRootCategories() {
        return taxonomyRepository.findByParentIsNull();
    }

    /**
     * Retrieves all immediate child sub-categories for a given parent ID.
     */
    @Transactional(readOnly = true)
    public List<TaxonomyCategory> getChildren(Long parentId) {
        // First, check if the parent category actually exists
        if (!taxonomyRepository.existsById(parentId)) {
            throw new IllegalArgumentException("Parent category with ID " + parentId + " does not exist.");
        }
        return taxonomyRepository.findByParentId(parentId);
    }

    @Transactional
    public TaxonomyCategory createCategory(TaxonomyCategory category) {

        if (category.getName() == null || category.getName().trim().isEmpty()) {
            throw new IllegalArgumentException("Category name cannot be empty.");
        }
        category.setSlug(generateSlug(category.getName()));

        // 2. Handle parent-child calculations
        if (category.getParent() != null && category.getParent().getId() != null) {
            // Fetch the full parent entity from the DB to read its level
            TaxonomyCategory parentEntity = taxonomyRepository.findById(category.getParent().getId())
                    .orElseThrow(() -> new IllegalArgumentException("Assigned parent category not found."));

            category.setParent(parentEntity);
            category.setLevel(parentEntity.getLevel() + 1); // Child is always parent level + 1
        } else {
            // No parent provided, meaning this is a brand new top-level root
            category.setParent(null);
            category.setLevel(0);
        }


        return taxonomyRepository.save(category);
    }


    @Transactional
    public void deleteCategory(Long id) {
        if (!taxonomyRepository.existsById(id)) {
            throw new IllegalArgumentException("Category with ID " + id + " does not exist.");
        }
        taxonomyRepository.deleteById(id);
    }

    private String generateSlug(String input) {
        return input.toLowerCase()
                .replaceAll("[^a-z0-9\\s]", "") // Remove special characters
                .replaceAll("\\s+", "-")        // Replace spaces with single hyphens
                .trim();
    }
}