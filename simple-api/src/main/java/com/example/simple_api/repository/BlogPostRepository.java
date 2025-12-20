package com.example.simple_api.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.example.simple_api.entities.BlogPost;

@Repository
public interface BlogPostRepository extends JpaRepository<BlogPost, Long> {
    
    @Query("SELECT DISTINCT p FROM BlogPost p LEFT JOIN FETCH p.tags LEFT JOIN FETCH p.author WHERE p.published = true ORDER BY p.publishedAt DESC")
    List<BlogPost> findByPublishedTrueOrderByPublishedAtDesc();
    
    // Paginated version
    @Query(value = "SELECT DISTINCT p FROM BlogPost p LEFT JOIN FETCH p.tags LEFT JOIN FETCH p.author WHERE p.published = true",
           countQuery = "SELECT COUNT(DISTINCT p) FROM BlogPost p WHERE p.published = true")
    Page<BlogPost> findPublishedPosts(Pageable pageable);
    
    @Query("SELECT DISTINCT p FROM BlogPost p LEFT JOIN FETCH p.tags LEFT JOIN FETCH p.author WHERE p.id = :id")
    Optional<BlogPost> findByIdWithTags(@Param("id") Long id);
    
    @Query("SELECT DISTINCT p FROM BlogPost p LEFT JOIN FETCH p.tags LEFT JOIN FETCH p.author ORDER BY p.publishedAt DESC")
    List<BlogPost> findAllWithTagsAndAuthor();
    
    @Query("SELECT DISTINCT p FROM BlogPost p LEFT JOIN FETCH p.tags t LEFT JOIN FETCH p.author WHERE t.slug = :slug AND p.published = true ORDER BY p.publishedAt DESC")
    List<BlogPost> findByTagSlug(@Param("slug") String slug);
    
    @Query("SELECT DISTINCT p FROM BlogPost p LEFT JOIN FETCH p.tags LEFT JOIN FETCH p.author WHERE p.published = true AND (LOWER(p.title) LIKE LOWER(CONCAT('%', :query, '%')) OR LOWER(p.excerpt) LIKE LOWER(CONCAT('%', :query, '%'))) ORDER BY p.publishedAt DESC")
    List<BlogPost> searchPublishedPosts(@Param("query") String query);
}