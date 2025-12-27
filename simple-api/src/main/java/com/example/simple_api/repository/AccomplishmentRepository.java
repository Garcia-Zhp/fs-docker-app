package com.example.simple_api.repository;

import org.springframework.stereotype.Repository;

import com.example.simple_api.entities.Accomplishment;

import org.springframework.data.jpa.repository.JpaRepository;


@Repository
public interface AccomplishmentRepository extends JpaRepository<Accomplishment, Long> {
    
}
