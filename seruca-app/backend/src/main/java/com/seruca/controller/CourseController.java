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