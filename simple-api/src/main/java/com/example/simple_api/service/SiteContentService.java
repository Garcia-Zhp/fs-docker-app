package com.example.simple_api.service;

import com.example.simple_api.dto.SiteContentDTO;
import com.example.simple_api.entities.SiteContent;
import com.example.simple_api.repository.SiteContentRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class SiteContentService {
    
    @Autowired
    private SiteContentRepository siteContentRepository;
    
    @Transactional(readOnly = true)
    public List<SiteContentDTO> getAllContent() {
        return siteContentRepository.findAll()
                .stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }
    
    @Transactional(readOnly = true)
    public Optional<SiteContentDTO> getContentBySection(String section) {
        return siteContentRepository.findBySection(section)
                .map(this::convertToDTO);
    }
    
    @Transactional
    public SiteContentDTO createOrUpdateContent(String section, String content) {
        SiteContent siteContent = siteContentRepository.findBySection(section)
                .orElse(new SiteContent());
        
        siteContent.setSection(section);
        siteContent.setContent(content);
        
        SiteContent saved = siteContentRepository.save(siteContent);
        return convertToDTO(saved);
    }
    
    @Transactional
    public boolean deleteContent(String section) {
        Optional<SiteContent> content = siteContentRepository.findBySection(section);
        if (content.isPresent()) {
            siteContentRepository.delete(content.get());
            return true;
        }
        return false;
    }
    
    private SiteContentDTO convertToDTO(SiteContent content) {
        SiteContentDTO dto = new SiteContentDTO();
        dto.setId(content.getId());
        dto.setSection(content.getSection());
        dto.setContent(content.getContent());
        return dto;
    }
}