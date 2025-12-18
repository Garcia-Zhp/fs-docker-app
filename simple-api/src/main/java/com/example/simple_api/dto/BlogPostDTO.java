package com.example.simple_api.dto;

import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;
import java.time.LocalDateTime;
import java.util.Set;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class BlogPostDTO {
    private Long id;
    private String title;
    private String excerpt;
    private String content;
    private String emoji;
    private String cardColorStart;
    private String cardColorEnd;
    private Boolean published;
    private LocalDateTime publishedAt;
    private Integer readTime;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
    private AuthorDTO author;
    private Set<TagDTO> tags;
}