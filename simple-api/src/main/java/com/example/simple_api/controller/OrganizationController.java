package com.example.simple_api.controller;

import com.example.simple_api.dto.OrganizationDTO;
import com.example.simple_api.service.OrganizationService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/organization")
@CrossOrigin(origins = {"http://localhost:4200", "${app.frontend-url}"})
public class OrganizationController {
    
    @Autowired
    private OrganizationService organizationService;
    
    // GET all organizations (admin)
    @GetMapping("/admin/all")
    public ResponseEntity<List<OrganizationDTO>> getAllOrganizations() {
        List<OrganizationDTO> organizations = organizationService.getAllOrganizations();
        return ResponseEntity.ok(organizations);
    }
    
    // GET organization by ID (admin)
    @GetMapping("/admin/{id}")
    public ResponseEntity<OrganizationDTO> getOrganizationById(@PathVariable Long id) {
        try {
            OrganizationDTO organization = organizationService.getOrganizationById(id);
            return ResponseEntity.ok(organization);
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        }
    }
    
    // POST create new organization (admin)
    @PostMapping("/admin")
    public ResponseEntity<OrganizationDTO> createOrganization(@RequestBody OrganizationDTO dto) {
        try {
            OrganizationDTO created = organizationService.createOrganization(dto);
            return ResponseEntity.status(HttpStatus.CREATED).body(created);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().build();
        }
    }
    
    // PUT update organization (admin)
    @PutMapping("/admin/{id}")
    public ResponseEntity<OrganizationDTO> updateOrganization(
        @PathVariable Long id, 
        @RequestBody OrganizationDTO dto
    ) {
        try {
            OrganizationDTO updated = organizationService.updateOrganization(id, dto);
            return ResponseEntity.ok(updated);
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        }
    }
    
    // DELETE organization (admin)
    @DeleteMapping("/admin/{id}")
    public ResponseEntity<Void> deleteOrganization(@PathVariable Long id) {
        try {
            organizationService.deleteOrganization(id);
            return ResponseEntity.noContent().build();
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        }
    }
}