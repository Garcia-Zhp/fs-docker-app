package com.example.simple_api.repository;
import com.example.simple_api.entities.Quotes;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
/**
 * Repository interface for the Quotes entity.
 * By extending JpaRepository<Entity, IdType>, Spring Data JPA automatically
 * provides methods like findAll, findById, save, delete, etc., without
 * needing any implementation code.
 */
@Repository
public interface QuotesRepository extends JpaRepository<Quotes, Long> {
    
    // No implementation needed! Spring handles it all.
    // If you need custom queries later, they can be defined here.
    
}