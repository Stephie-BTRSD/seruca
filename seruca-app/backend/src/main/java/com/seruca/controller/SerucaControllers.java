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
import org.springframework.web.bind.annotation.*;
import java.util.List;
import java.util.Map;

// ============================================================
// USER MANAGEMENT
// ============================================================
@RestController
@RequestMapping("/api/users")
class UserController {

    @Autowired private UserRepository userRepository;

    @GetMapping
    @PreAuthorize("hasRole('ADMIN')")
    public List<User> getAllUsers() {
        return userRepository.findAll();
    }

    @GetMapping("/{id}")
    public ResponseEntity<User> getUser(@PathVariable Long id) {
        return userRepository.findById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PutMapping("/{id}/role")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<User> updateRole(@PathVariable Long id,
                                            @RequestBody Map<String, String> body) {
        return userRepository.findById(id).map(user -> {
            user.setRole(User.Role.valueOf(body.get("role")));
            return ResponseEntity.ok(userRepository.save(user));
        }).orElse(ResponseEntity.notFound().build());
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Void> deleteUser(@PathVariable Long id) {
        userRepository.deleteById(id);
        return ResponseEntity.noContent().build();
    }
}

// ============================================================
// CONTENT MANAGEMENT (COURSES)
// ============================================================
@RestController
@RequestMapping("/api/courses")
class CourseController {

    @Autowired private CourseRepository courseRepository;

    @GetMapping
    public List<Course> getAllCourses() {
        return courseRepository.findAll();
    }

    @GetMapping("/published")
    public List<Course> getPublished() {
        return courseRepository.findByStatus(Course.Status.PUBLISHED);
    }

    @GetMapping("/{id}")
    public ResponseEntity<Course> getCourse(@PathVariable Long id) {
        return courseRepository.findById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping
    @PreAuthorize("hasAnyRole('ADMIN','LECTURER')")
    public Course createCourse(@RequestBody Course course) {
        course.setStatus(Course.Status.DRAFT);
        return courseRepository.save(course);
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasAnyRole('ADMIN','LECTURER')")
    public ResponseEntity<Course> updateCourse(@PathVariable Long id,
                                                @RequestBody Course updated) {
        return courseRepository.findById(id).map(course -> {
            course.setTitle(updated.getTitle());
            course.setDescription(updated.getDescription());
            course.setStatus(updated.getStatus());
            return ResponseEntity.ok(courseRepository.save(course));
        }).orElse(ResponseEntity.notFound().build());
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Void> deleteCourse(@PathVariable Long id) {
        courseRepository.deleteById(id);
        return ResponseEntity.noContent().build();
    }
}

// ============================================================
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
