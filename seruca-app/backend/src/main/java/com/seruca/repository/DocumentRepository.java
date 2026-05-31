package com.seruca.repository;

import com.seruca.entity.Document;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface DocumentRepository extends JpaRepository<Document, Long> {
    List<Document> findByCourseId(Long courseId);
    List<Document> findByCategoryId(Long categoryId);

    @Query("SELECT d FROM Document d WHERE " +
           "LOWER(d.title) LIKE LOWER(CONCAT('%', :query, '%')) OR " +
           "LOWER(d.content) LIKE LOWER(CONCAT('%', :query, '%'))")
    List<Document> searchByQuery(@Param("query") String query);
}
