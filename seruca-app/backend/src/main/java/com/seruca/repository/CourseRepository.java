package com.seruca.repository;

import com.seruca.entity.Course;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface CourseRepository extends JpaRepository<Course, Long> {

    List<Course> findByLecturerId(Long lecturerId);

    List<Course> findByStatus(Course.Status status);

    List<Course> findByCategoryId(Long categoryId);

    Optional<Course> findByCode(String code);

    boolean existsByCode(String code);

    Page<Course> findByStatus(Course.Status status, Pageable pageable);

    Page<Course> findByLecturerId(Long lecturerId, Pageable pageable);

    @Query("SELECT c FROM Course c WHERE c.status = :status AND " +
           "(LOWER(c.title) LIKE LOWER(CONCAT('%', :keyword, '%')) OR " +
           "LOWER(c.code) LIKE LOWER(CONCAT('%', :keyword, '%')))")
    Page<Course> searchPublished(@Param("keyword") String keyword,
                                 @Param("status") Course.Status status,
                                 Pageable pageable);

    @Query("SELECT c FROM Course c WHERE " +
           "(LOWER(c.title) LIKE LOWER(CONCAT('%', :keyword, '%')) OR " +
           "LOWER(c.code) LIKE LOWER(CONCAT('%', :keyword, '%')))")
    Page<Course> searchAll(@Param("keyword") String keyword, Pageable pageable);

    boolean existsByIdAndLecturerId(Long id, Long lecturerId);
}
