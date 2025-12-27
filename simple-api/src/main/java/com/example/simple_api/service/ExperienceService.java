package com.example.simple_api.service;

import com.example.simple_api.dto.AccomplishmentDTO;
import com.example.simple_api.dto.ExperienceDTO;
import com.example.simple_api.entities.Accomplishment;
import com.example.simple_api.entities.Experience;
import com.example.simple_api.entities.Organization;
import com.example.simple_api.repository.ExperienceRepository;
import com.example.simple_api.repository.OrganizationRepository;
import com.example.simple_api.repository.AccomplishmentRepository;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.time.format.DateTimeFormatter;
import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class ExperienceService {
    
    @Autowired
    private ExperienceRepository experienceRepository;
    
    @Autowired
    private OrganizationRepository organizationRepository;

    @Autowired
    private AccomplishmentRepository accomplishmentRepository;

    private static final DateTimeFormatter DATE_FORMATTER = DateTimeFormatter.ISO_LOCAL_DATE;

    @Transactional(readOnly = true)
    public List<ExperienceDTO> getPublishedExperiences() {
        List<Experience> experiences = experienceRepository.findByPublishedTrueOrderBySortOrderAsc();
        
        return experiences.stream()
            .map(this::convertToDTO)
            .collect(Collectors.toList());
    }
    
    @Transactional(readOnly = true)
    public List<ExperienceDTO> getAllExperiences() {
        List<Experience> experiences = experienceRepository.findAllByOrderBySortOrderAsc();
        
        return experiences.stream()
            .map(this::convertToDTO)
            .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public ExperienceDTO getExperienceById(Long id) {
        Experience experience = experienceRepository.findById(id)
            .orElseThrow(() -> new RuntimeException("Experience not found with id: " + id));
        
        return convertToDTO(experience);
    }

    // Create experience
    @Transactional
    public ExperienceDTO createExperience(ExperienceDTO dto) {
        Organization organization = organizationRepository.findById(dto.getOrganizationId())
            .orElseThrow(() -> new RuntimeException("Organization not found with id: " + dto.getOrganizationId()));
        
        Experience experience = new Experience();
        experience.setOrganization(organization);
        experience.setRoleTitle(dto.getRoleTitle());
        
        experience.setStartDate(parseDate(dto.getStartDate()));
        experience.setEndDate(parseDate(dto.getEndDate())); // Handles null
        
        experience.setDescription(dto.getDescription());
        experience.setPublished(dto.getPublished() != null ? dto.getPublished() : false);
        experience.setSortOrder(dto.getSortOrder() != null ? dto.getSortOrder() : 0);
        
        Experience saved = experienceRepository.save(experience);
        return convertToDTO(saved);
    }

    
    @Transactional
    public ExperienceDTO updateExperience(Long id, ExperienceDTO dto) {
        Experience experience = experienceRepository.findById(id)
            .orElseThrow(() -> new RuntimeException("Experience not found with id: " + id));
        
        // Update organization if changed
        if (dto.getOrganizationId() != null && 
            !experience.getOrganization().getId().equals(dto.getOrganizationId())) {
            Organization organization = organizationRepository.findById(dto.getOrganizationId())
                .orElseThrow(() -> new RuntimeException("Organization not found with id: " + dto.getOrganizationId()));
            experience.setOrganization(organization);
        }
        
        experience.setRoleTitle(dto.getRoleTitle());
        
        experience.setStartDate(parseDate(dto.getStartDate()));
        experience.setEndDate(parseDate(dto.getEndDate())); // Handles null
        
        experience.setDescription(dto.getDescription());
        experience.setPublished(dto.getPublished() != null ? dto.getPublished() : false);
        experience.setSortOrder(dto.getSortOrder() != null ? dto.getSortOrder() : 0);
        
        Experience updated = experienceRepository.save(experience);
        return convertToDTO(updated);
    }

    @Transactional
    public void deleteExperience(Long id) {
        if (!experienceRepository.existsById(id)) {
            throw new RuntimeException("Experience not found with id: " + id);
        }
        experienceRepository.deleteById(id);
    }
    
    // Update accomplishments for an experience
    @Transactional
    public List<AccomplishmentDTO> updateAccomplishments(Long experienceId, List<AccomplishmentDTO> dtos) {
        // Find the experience
        Experience experience = experienceRepository.findById(experienceId)
            .orElseThrow(() -> new RuntimeException("Experience not found with id: " + experienceId));
        
        // Clear existing accomplishments
        experience.getAccomplishments().clear();
        accomplishmentRepository.flush(); // Ensure delete happens before insert
        
        // Create new accomplishments from DTOs
        List<Accomplishment> newAccomplishments = new ArrayList<>();
        
        for (AccomplishmentDTO dto : dtos) {
            Accomplishment accomplishment = new Accomplishment();
            accomplishment.setContent(dto.getContent());
            accomplishment.setSortOrder(dto.getSortOrder() != null ? dto.getSortOrder() : 0);
            accomplishment.setPublished(dto.getPublished() != null ? dto.getPublished() : true);
            accomplishment.setExperience(experience);
            
            newAccomplishments.add(accomplishment);
        }
        
        // Add to experience (cascade will save them)
        experience.getAccomplishments().addAll(newAccomplishments);
        
        // Save experience (cascades to accomplishments)
        Experience saved = experienceRepository.save(experience);
        
        // Convert to DTOs and return
        return saved.getAccomplishments().stream()
            .map(this::convertAccomplishmentToDTO)
            .collect(Collectors.toList());
    }


    //----------------------------------------------------------------------------------
    // HELPER METHODS:
    //----------------------------------------------------------------------------------

    // Helper method to convert Accomplishment to DTO
    private AccomplishmentDTO convertAccomplishmentToDTO(Accomplishment accomplishment) {
        return AccomplishmentDTO.builder()
            .id(accomplishment.getId())
            .content(accomplishment.getContent())
            .sortOrder(accomplishment.getSortOrder())
            .published(accomplishment.getPublished())
            .build();
    }

    private ExperienceDTO convertToDTO(Experience experience) {
        // Extract only published accomplishments, sorted by sort_order
        List<String> accomplishmentTexts = experience.getAccomplishments().stream()
            .filter(Accomplishment::getPublished)
            .sorted((a, b) -> a.getSortOrder().compareTo(b.getSortOrder()))
            .map(Accomplishment::getContent)
            .collect(Collectors.toList());
        
        return ExperienceDTO.builder()
            .id(experience.getId())
            .organizationId(experience.getOrganization().getId())  // ✅ Add organizationId
            .organization(experience.getOrganization().getOrgName())
            .organizationType(experience.getOrganization().getType())
            .roleTitle(experience.getRoleTitle())
            .startDate(formatDate(experience.getStartDate()))  // ✅ LocalDate → String
            .endDate(formatDate(experience.getEndDate()))      // ✅ LocalDate → String (handles null)
            .description(experience.getDescription())
            .published(experience.getPublished())              // ✅ Add published
            .sortOrder(experience.getSortOrder())              // ✅ Add sortOrder
            .accomplishments(accomplishmentTexts)
            .build();
    }

    private LocalDate parseDate(String dateString) {
        if (dateString == null || dateString.trim().isEmpty()) {
            return null;
        }
        
        try {
            return LocalDate.parse(dateString, DATE_FORMATTER);
        } catch (Exception e) {
            throw new RuntimeException("Invalid date format: " + dateString + ". Expected format: yyyy-MM-dd", e);
        }
    }
    
    private String formatDate(LocalDate date) {
        if (date == null) {
            return null;
        }
        return date.format(DATE_FORMATTER);
    }
}