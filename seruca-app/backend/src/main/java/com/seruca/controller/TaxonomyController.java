package com.seruca.controller;

import com.seruca.entity.Course;
import com.seruca.entity.Document;
import com.seruca.entity.TaxonomyCategory;
import com.seruca.entity.User;
import com.seruca.repository.CourseRepository;
import com.seruca.repository.DocumentRepository;
import com.seruca.repository.TaxonomyCategoryRepository;
import com.seruca.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

//  ============================================================
// TAXONOMY MANAGEMENT
// ============================================================
@RestController
@RequestMapping("/api/taxonomy")
class TaxonomyController {

    @Autowired private TaxonomyCategoryRepository taxonomyRepository;

    @GetMapping
    public List<TaxonomyCategory> getRootCategories() {
        return taxonomyRepository.findByParentIsNull();
    }

    @GetMapping("/{id}/children")
    public List<TaxonomyCategory> getChildren(@PathVariable Long id) {
        return taxonomyRepository.findByParentId(id);
    }

    @PostMapping
    @PreAuthorize("hasRole('ADMIN')")
    public TaxonomyCategory createCategory(@RequestBody TaxonomyCategory category) {
        return taxonomyRepository.save(category);
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Void> deleteCategory(@PathVariable Long id) {
        taxonomyRepository.deleteById(id);
        return ResponseEntity.noContent().build();
    }
}
