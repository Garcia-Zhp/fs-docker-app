package com.example.simple_api.service;

import com.example.simple_api.dto.OrganizationDTO;
import com.example.simple_api.entities.Organization;
import com.example.simple_api.repository.OrganizationRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class OrganizationService {
    
    @Autowired
    private OrganizationRepository organizationRepository;
    
    // Get all organizations
    @Transactional(readOnly = true)
    public List<OrganizationDTO> getAllOrganizations() {
        List<Organization> organizations = organizationRepository.findAll();
        
        return organizations.stream()
            .map(this::convertToDTO)
            .collect(Collectors.toList());
    }
    
    // Get organization by ID
    @Transactional(readOnly = true)
    public OrganizationDTO getOrganizationById(Long id) {
        Organization organization = organizationRepository.findById(id)
            .orElseThrow(() -> new RuntimeException("Organization not found with id: " + id));
        
        return convertToDTO(organization);
    }
    
    // Create new organization
    @Transactional
    public OrganizationDTO createOrganization(OrganizationDTO dto) {
        // Check if organization name already exists
        if (organizationRepository.existsByOrgName(dto.getOrgName())) {
            throw new RuntimeException("Organization with name '" + dto.getOrgName() + "' already exists");
        }
        
        Organization organization = new Organization();
        organization.setOrgName(dto.getOrgName());
        organization.setType(dto.getType());
        
        Organization saved = organizationRepository.save(organization);
        return convertToDTO(saved);
    }
    
    // Update organization
    @Transactional
    public OrganizationDTO updateOrganization(Long id, OrganizationDTO dto) {
        Organization organization = organizationRepository.findById(id)
            .orElseThrow(() -> new RuntimeException("Organization not found with id: " + id));
        
        // Check if new name conflicts with another organization
        if (!organization.getOrgName().equals(dto.getOrgName()) 
            && organizationRepository.existsByOrgName(dto.getOrgName())) {
            throw new RuntimeException("Organization with name '" + dto.getOrgName() + "' already exists");
        }
        
        organization.setOrgName(dto.getOrgName());
        organization.setType(dto.getType());
        
        Organization updated = organizationRepository.save(organization);
        return convertToDTO(updated);
    }
    
    // Delete organization
    @Transactional
    public void deleteOrganization(Long id) {
        if (!organizationRepository.existsById(id)) {
            throw new RuntimeException("Organization not found with id: " + id);
        }
        
        organizationRepository.deleteById(id);
    }
    
    // Convert entity to DTO
    private OrganizationDTO convertToDTO(Organization organization) {
        return OrganizationDTO.builder()
            .id(organization.getId())
            .orgName(organization.getOrgName())
            .type(organization.getType())
            .build();
    }
}