package com.example.simple_api.controller;

import com.example.simple_api.dto.TagDTO;
import com.example.simple_api.entities.Tag;
import com.example.simple_api.service.TagService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.lang.NonNull;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/tags")
@CrossOrigin(origins = "http://localhost:4200")
public class TagController {
    
    @Autowired
    private TagService tagService;
    
    @GetMapping
    public ResponseEntity<List<TagDTO>> getAllTags() {
        List<TagDTO> tags = tagService.getAllTags();
        return ResponseEntity.ok(tags);
    }
    
    @GetMapping("/{slug}")
    public ResponseEntity<TagDTO> getTagBySlug(@PathVariable String slug) {
        return tagService.getTagBySlug(slug)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }
    
    // Admin endpoints
    @PostMapping("/admin")
    public ResponseEntity<TagDTO> createTag(@RequestBody Tag tag) {
        TagDTO created = tagService.createTag(tag);
        return ResponseEntity.ok(created);
    }
    
    @PutMapping("/admin/{id}")
    public ResponseEntity<TagDTO> updateTag(@NonNull @PathVariable Long id, @RequestBody Tag tag) {
        return tagService.updateTag(id, tag)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }
    
    @DeleteMapping("/admin/{id}")
    public ResponseEntity<Void> deleteTag(@NonNull @PathVariable Long id) {
        boolean deleted = tagService.deleteTag(id);
        return deleted ? ResponseEntity.noContent().build() : ResponseEntity.notFound().build();
    }
}