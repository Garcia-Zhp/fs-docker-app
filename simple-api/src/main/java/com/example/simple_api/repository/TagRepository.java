package com.example.simple_api.repository;

import com.example.simple_api.entities.Tag;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.Optional;
import java.util.List;

@Repository
public interface TagRepository extends JpaRepository<Tag, Long> {
    
    Optional<Tag> findBySlug(String slug);
    
    Optional<Tag> findByName(String name);
    
    boolean existsBySlug(String slug);
    
    boolean existsByName(String name);
    
    List<Tag> findAllByOrderByNameAsc();
}