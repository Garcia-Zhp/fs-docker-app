package com.example.simple_api.repository;

import com.example.simple_api.entities.SiteContent;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.Optional;

@Repository
public interface SiteContentRepository extends JpaRepository<SiteContent, Long> {
    
    Optional<SiteContent> findBySection(String section);
    
    boolean existsBySection(String section);
}