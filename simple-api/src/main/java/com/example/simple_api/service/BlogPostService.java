package com.example.simple_api.service;

import com.example.simple_api.dto.BlogPostDTO;
import com.example.simple_api.dto.AuthorDTO;
import com.example.simple_api.dto.TagDTO;
import com.example.simple_api.entities.BlogPost;
import com.example.simple_api.entities.Tag;
import com.example.simple_api.repository.BlogPostRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class BlogPostService {
    
    @Autowired
    private BlogPostRepository blogPostRepository;
    
    @Transactional(readOnly = true)
    public List<BlogPostDTO> getAllPublishedPosts() {
        return blogPostRepository.findByPublishedTrueOrderByPublishedAtDesc()
                .stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }
    
    @Transactional(readOnly = true)
    public Optional<BlogPostDTO> getPostById(Long id) {
        return blogPostRepository.findById(id)
                .filter(BlogPost::getPublished)
                .map(this::convertToDTO);
    }
    
    @Transactional(readOnly = true)
    public List<BlogPostDTO> getPostsByTag(String tagSlug) {
        return blogPostRepository.findByTagSlug(tagSlug)
                .stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }
    
    @Transactional(readOnly = true)
    public List<BlogPostDTO> searchPosts(String query) {
        return blogPostRepository.searchPublishedPosts(query)
                .stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }
    
    @Transactional(readOnly = true)
    public List<BlogPostDTO> getAllPosts(boolean publishedOnly) {
        List<BlogPost> posts = publishedOnly 
            ? blogPostRepository.findByPublishedTrueOrderByPublishedAtDesc()
            : blogPostRepository.findByPublishedOrderByCreatedAtDesc(null);
        
        return posts.stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }
    
    @Transactional
    public BlogPostDTO createPost(BlogPost post) {
        BlogPost savedPost = blogPostRepository.save(post);
        return convertToDTO(savedPost);
    }
    
    @Transactional
    public Optional<BlogPostDTO> updatePost(Long id, BlogPost postDetails) {
        return blogPostRepository.findById(id)
                .map(post -> {
                    post.setTitle(postDetails.getTitle());
                    post.setExcerpt(postDetails.getExcerpt());
                    post.setContent(postDetails.getContent());
                    post.setEmoji(postDetails.getEmoji());
                    post.setCardColorStart(postDetails.getCardColorStart());
                    post.setCardColorEnd(postDetails.getCardColorEnd());
                    post.setPublished(postDetails.getPublished());
                    post.setPublishedAt(postDetails.getPublishedAt());
                    post.setReadTime(postDetails.getReadTime());
                    post.setTags(postDetails.getTags());
                    return convertToDTO(blogPostRepository.save(post));
                });
    }
    
    @Transactional
    public boolean deletePost(Long id) {
        if (blogPostRepository.existsById(id)) {
            blogPostRepository.deleteById(id);
            return true;
        }
        return false;
    }
    
    private BlogPostDTO convertToDTO(BlogPost post) {
        BlogPostDTO dto = new BlogPostDTO();
        dto.setId(post.getId());
        dto.setTitle(post.getTitle());
        dto.setExcerpt(post.getExcerpt());
        dto.setContent(post.getContent());
        dto.setEmoji(post.getEmoji());
        dto.setCardColorStart(post.getCardColorStart());
        dto.setCardColorEnd(post.getCardColorEnd());
        dto.setPublished(post.getPublished());
        dto.setPublishedAt(post.getPublishedAt());
        dto.setReadTime(post.getReadTime());
        dto.setCreatedAt(post.getCreatedAt());
        dto.setUpdatedAt(post.getUpdatedAt());
        
        // Convert author
        if (post.getAuthor() != null) {
            AuthorDTO authorDTO = new AuthorDTO();
            authorDTO.setId(post.getAuthor().getId());
            authorDTO.setName(post.getAuthor().getName());
            authorDTO.setTitle(post.getAuthor().getTitle());
            authorDTO.setBio(post.getAuthor().getBio());
            authorDTO.setProfilePictureUrl(post.getAuthor().getProfilePictureUrl());
            dto.setAuthor(authorDTO);
        }
        
        // Convert tags
        dto.setTags(post.getTags().stream()
                .map(this::convertTagToDTO)
                .collect(Collectors.toSet()));
        
        return dto;
    }
    
    private TagDTO convertTagToDTO(Tag tag) {
        TagDTO dto = new TagDTO();
        dto.setId(tag.getId());
        dto.setName(tag.getName());
        dto.setSlug(tag.getSlug());
        return dto;
    }
}