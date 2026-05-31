package com.seruca.repository;

import com.seruca.entity.Course;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface CourseRepository extends JpaRepository<Course, Long> {
    List<Course> findByLecturerId(Long lecturerId);
    List<Course> findByStatus(Course.Status status);
    List<Course> findByCategoryId(Long categoryId);
}
