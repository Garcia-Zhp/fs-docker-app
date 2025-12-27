package com.example.simple_api.controller;

import com.example.simple_api.dto.ExperienceDTO;
import com.example.simple_api.service.ExperienceService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import com.example.simple_api.dto.AccomplishmentDTO;
import java.util.List;


@RestController
@RequestMapping("/api/experience")
@CrossOrigin(origins = {"http://localhost:4200", "${app.frontend-url}"})
public class ExperienceController {
    
    @Autowired
    private ExperienceService experienceService;
    
    // Public endpoint - get published experiences for portfolio display
    @GetMapping("/published")
    public ResponseEntity<List<ExperienceDTO>> getPublishedExperiences() {
        List<ExperienceDTO> experiences = experienceService.getPublishedExperiences();
        return ResponseEntity.ok(experiences);
    }
    
    // Admin endpoint - get all experiences (published and unpublished)
    @GetMapping("/admin/all")
    public ResponseEntity<List<ExperienceDTO>> getAllExperiences() {
        List<ExperienceDTO> experiences = experienceService.getAllExperiences();
        return ResponseEntity.ok(experiences);
    }

    @GetMapping("/admin/{id}")
    public ResponseEntity<ExperienceDTO> getExperience(@PathVariable Long id) {
        ExperienceDTO experience = experienceService.getExperienceById(id);
        return ResponseEntity.ok(experience);
    }

    @PostMapping("/admin")
    public ResponseEntity<ExperienceDTO> createExperience(@RequestBody ExperienceDTO dto) {
        ExperienceDTO created = experienceService.createExperience(dto);
        return ResponseEntity.ok(created);
    }

    // PUT - Update accomplishments for an experience
    @PutMapping("/admin/{experienceId}/accomplishments")
    public ResponseEntity<List<AccomplishmentDTO>> updateAccomplishments(@PathVariable Long experienceId, @RequestBody List<AccomplishmentDTO> accomplishments) {
        try {
            List<AccomplishmentDTO> updated = experienceService.updateAccomplishments(experienceId, accomplishments);
            return ResponseEntity.ok(updated);
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        }
    }

}