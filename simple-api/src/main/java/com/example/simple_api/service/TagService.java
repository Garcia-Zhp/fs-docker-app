package com.example.simple_api.service;

import com.example.simple_api.dto.TagDTO;
import com.example.simple_api.entities.Tag;
import com.example.simple_api.repository.TagRepository;

import org.springframework.lang.NonNull;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class TagService {
    
    @Autowired
    private TagRepository tagRepository;
    
    @Transactional(readOnly = true)
    public List<TagDTO> getAllTags() {
        return tagRepository.findAllByOrderByNameAsc()
                .stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }
    
    @Transactional(readOnly = true)
    public Optional<TagDTO> getTagBySlug(String slug) {
        return tagRepository.findBySlug(slug)
                .map(this::convertToDTO);
    }
    
    @Transactional
    public TagDTO createTag(Tag tag) {
        // Generate slug from name if not provided
        if (tag.getSlug() == null || tag.getSlug().isEmpty()) {
            tag.setSlug(generateSlug(tag.getName()));
        }
        Tag savedTag = tagRepository.save(tag);
        return convertToDTO(savedTag);
    }
    
    @Transactional
    public Optional<TagDTO> updateTag(@NonNull Long id, Tag tagDetails) {
        return tagRepository.findById(id)
                .map(tag -> {
                    tag.setName(tagDetails.getName());
                    if (tagDetails.getSlug() != null) {
                        tag.setSlug(tagDetails.getSlug());
                    }
                    return convertToDTO(tagRepository.save(tag));
                });
    }
    
    @Transactional
    public boolean deleteTag(@NonNull Long id) {
        if (tagRepository.existsById(id)) {
            tagRepository.deleteById(id);
            return true;
        }
        return false;
    }
    
    private String generateSlug(String name) {
        return name.toLowerCase()
                .replaceAll("[^a-z0-9\\s-]", "")
                .replaceAll("\\s+", "-")
                .replaceAll("-+", "-")
                .trim();
    }
    
    private TagDTO convertToDTO(Tag tag) {
        TagDTO dto = new TagDTO();
        dto.setId(tag.getId());
        dto.setName(tag.getName());
        dto.setSlug(tag.getSlug());
        return dto;
    }
}