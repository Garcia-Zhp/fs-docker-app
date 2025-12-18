package com.example.simple_api.repository;

import com.example.simple_api.entities.BlogPost;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface BlogPostRepository extends JpaRepository<BlogPost, Long> {
    
    List<BlogPost> findByPublishedTrueOrderByPublishedAtDesc();
    
    List<BlogPost> findByAuthorIdOrderByCreatedAtDesc(Long authorId);
    
    List<BlogPost> findByPublishedOrderByCreatedAtDesc(Boolean published);
    
    @Query("SELECT p FROM BlogPost p JOIN p.tags t WHERE t.slug = :tagSlug AND p.published = true ORDER BY p.publishedAt DESC")
    List<BlogPost> findByTagSlug(@Param("tagSlug") String tagSlug);
    
    @Query("SELECT p FROM BlogPost p WHERE p.published = true AND " +
           "(LOWER(p.title) LIKE LOWER(CONCAT('%', :query, '%')) OR " +
           "LOWER(p.excerpt) LIKE LOWER(CONCAT('%', :query, '%'))) " +
           "ORDER BY p.publishedAt DESC")
    List<BlogPost> searchPublishedPosts(@Param("query") String query);
}