package com.example.simple_api.repository;

import com.example.simple_api.entities.Experience;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ExperienceRepository extends JpaRepository<Experience, Long> {
    
    List<Experience> findByOrganizationId(Long orgId);
    
    // Get published experiences ordered by sort_order
    @Query("SELECT e FROM Experience e " +
           "LEFT JOIN FETCH e.organization " +
           "LEFT JOIN FETCH e.accomplishments " +
           "WHERE e.published = true " +
           "ORDER BY e.sortOrder ASC")
    List<Experience> findByPublishedTrueOrderBySortOrderAsc();
    
    // Get all experiences (for admin)
    @Query("SELECT e FROM Experience e " +
           "LEFT JOIN FETCH e.organization " +
           "LEFT JOIN FETCH e.accomplishments " +
           "ORDER BY e.sortOrder ASC")
    List<Experience> findAllByOrderBySortOrderAsc();
}