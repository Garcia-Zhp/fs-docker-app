package com.example.simple_api.controller;

import com.example.simple_api.dto.SiteContentDTO;
import com.example.simple_api.service.SiteContentService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.lang.NonNull;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/content")
@CrossOrigin(origins = "http://localhost:4200")
public class SiteContentController {
    
    @Autowired
    private SiteContentService siteContentService;
    
    @GetMapping
    public ResponseEntity<List<SiteContentDTO>> getAllContent() {
        List<SiteContentDTO> content = siteContentService.getAllContent();
        return ResponseEntity.ok(content);
    }
    
    @GetMapping("/{section}")
    public ResponseEntity<SiteContentDTO> getContentBySection(@NonNull @PathVariable String section) {
        return siteContentService.getContentBySection(section)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }
    
    // Admin endpoints
    @SuppressWarnings("null")
    @PostMapping("/admin")
    public ResponseEntity<SiteContentDTO> createOrUpdateContent(@RequestBody Map<String, String> request) {
        String section = request.get("section");
        String content = request.get("content");
        SiteContentDTO updated = siteContentService.createOrUpdateContent(section, content);
        return ResponseEntity.ok(updated);
    }
    
    @DeleteMapping("/admin/{section}")
    public ResponseEntity<Void> deleteContent(@NonNull @PathVariable String section) {
        boolean deleted = siteContentService.deleteContent(section);
        return deleted ? ResponseEntity.noContent().build() : ResponseEntity.notFound().build();
    }
}