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

// ============================================================
// SEARCH ENGINE
// ============================================================
@RestController
@RequestMapping("/api/search")
class SearchController {

    @Autowired private DocumentRepository documentRepository;

    @GetMapping
    public ResponseEntity<List<Document>> search(@RequestParam String q) {
        if (q == null || q.trim().isEmpty()) {
            return ResponseEntity.badRequest().build();
        }
        List<Document> results = documentRepository.searchByQuery(q.trim());
        return ResponseEntity.ok(results);
    }
}
