package com.seruca.controller;

import com.seruca.dto.ApiResponse;
import com.seruca.dto.CourseRequest;
import com.seruca.dto.CourseResponse;
import com.seruca.entity.Document;
import com.seruca.entity.TaxonomyCategory;
import com.seruca.entity.User;
import com.seruca.repository.DocumentRepository;
import com.seruca.repository.TaxonomyCategoryRepository;
import com.seruca.repository.UserRepository;
import com.seruca.service.CourseService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
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

    @Autowired private CourseService courseService;

    // ── Public / Student endpoints ─────────────────────────────────────────

    /** Students (and all authenticated users) see only PUBLISHED courses with pagination + search */
    @GetMapping
    public ResponseEntity<ApiResponse<Page<CourseResponse>>> getPublished(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(required = false) String keyword) {
        return ResponseEntity.ok(ApiResponse.ok(courseService.getPublished(page, size, keyword)));
    }

    /** Any authenticated user can view a single published course */
    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<CourseResponse>> getCourse(@PathVariable Long id,
            @AuthenticationPrincipal UserDetails user) {
        boolean isPrivileged = user.getAuthorities().stream()
                .anyMatch(a -> a.getAuthority().equals("ROLE_ADMIN")
                        || a.getAuthority().equals("ROLE_LECTURER"));
        CourseResponse response = isPrivileged
                ? courseService.getById(id)
                : courseService.getPublishedById(id);
        return ResponseEntity.ok(ApiResponse.ok(response));
    }

    @GetMapping("/category/{categoryId}")
    public ResponseEntity<ApiResponse<List<CourseResponse>>> getByCategory(
            @PathVariable Long categoryId) {
        return ResponseEntity.ok(ApiResponse.ok(courseService.getByCategory(categoryId)));
    }

    // ── Admin / Lecturer endpoints ─────────────────────────────────────────

    /** Admin sees all courses across all statuses with pagination + search */
    @GetMapping("/manage")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ApiResponse<Page<CourseResponse>>> getAll(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(required = false) String keyword) {
        return ResponseEntity.ok(ApiResponse.ok(courseService.getAll(page, size, keyword)));
    }

    /** Lecturer sees their own courses */
    @GetMapping("/my")
    @PreAuthorize("hasAnyRole('ADMIN','LECTURER')")
    public ResponseEntity<ApiResponse<Page<CourseResponse>>> getMyCourses(
            @AuthenticationPrincipal UserDetails user,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {
        return ResponseEntity.ok(ApiResponse.ok(
                courseService.getMyCoures(user.getUsername(), page, size)));
    }

    @PostMapping
    @PreAuthorize("hasAnyRole('ADMIN','LECTURER')")
    public ResponseEntity<ApiResponse<CourseResponse>> createCourse(
            @Valid @RequestBody CourseRequest req,
            @AuthenticationPrincipal UserDetails user) {
        CourseResponse created = courseService.create(req, user.getUsername());
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.ok("Course created successfully", created));
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasAnyRole('ADMIN','LECTURER')")
    public ResponseEntity<ApiResponse<CourseResponse>> updateCourse(
            @PathVariable Long id,
            @Valid @RequestBody CourseRequest req,
            @AuthenticationPrincipal UserDetails user) {
        boolean isAdmin = user.getAuthorities().stream()
                .anyMatch(a -> a.getAuthority().equals("ROLE_ADMIN"));
        return ResponseEntity.ok(ApiResponse.ok("Course updated",
                courseService.update(id, req, user.getUsername(), isAdmin)));
    }

    @PatchMapping("/{id}/publish")
    @PreAuthorize("hasAnyRole('ADMIN','LECTURER')")
    public ResponseEntity<ApiResponse<CourseResponse>> publishCourse(
            @PathVariable Long id,
            @AuthenticationPrincipal UserDetails user) {
        boolean isAdmin = user.getAuthorities().stream()
                .anyMatch(a -> a.getAuthority().equals("ROLE_ADMIN"));
        return ResponseEntity.ok(ApiResponse.ok("Course published",
                courseService.publish(id, user.getUsername(), isAdmin)));
    }

    @PatchMapping("/{id}/archive")
    @PreAuthorize("hasAnyRole('ADMIN','LECTURER')")
    public ResponseEntity<ApiResponse<CourseResponse>> archiveCourse(
            @PathVariable Long id,
            @AuthenticationPrincipal UserDetails user) {
        boolean isAdmin = user.getAuthorities().stream()
                .anyMatch(a -> a.getAuthority().equals("ROLE_ADMIN"));
        return ResponseEntity.ok(ApiResponse.ok("Course archived",
                courseService.archive(id, user.getUsername(), isAdmin)));
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasAnyRole('ADMIN','LECTURER')")
    public ResponseEntity<ApiResponse<Void>> deleteCourse(
            @PathVariable Long id,
            @AuthenticationPrincipal UserDetails user) {
        boolean isAdmin = user.getAuthorities().stream()
                .anyMatch(a -> a.getAuthority().equals("ROLE_ADMIN"));
        courseService.delete(id, user.getUsername(), isAdmin);
        return ResponseEntity.ok(ApiResponse.ok("Course deleted", null));
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
