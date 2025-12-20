package com.example.simple_api.service;

import java.time.LocalDateTime;
import java.util.HashSet;
import java.util.Set;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.lang.NonNull;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import com.example.simple_api.dto.CreatePostRequest;
import com.example.simple_api.dto.AuthorDTO;
import com.example.simple_api.dto.BlogPostDTO;
import com.example.simple_api.dto.TagDTO;
import com.example.simple_api.entities.BlogPost;
import com.example.simple_api.entities.Tag;
import com.example.simple_api.entities.User;
import com.example.simple_api.repository.BlogPostRepository;
import com.example.simple_api.repository.TagRepository;
import com.example.simple_api.repository.UserRepository;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import com.example.simple_api.dto.PagedResponse;

@Service
public class BlogPostService {
    
    @Autowired
    private BlogPostRepository blogPostRepository;
    
    @Autowired
    private UserRepository userRepository;

    @Autowired
    private TagRepository tagRepository;

    // ===== NEW: Helper methods to get current user from JWT =====
    private String getCurrentUserEmail() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        if (authentication != null && authentication.isAuthenticated()) {
            return authentication.getName();
        }
        throw new RuntimeException("User not authenticated");
    }

    private User getCurrentUser() {
        String email = getCurrentUserEmail();
        return userRepository.findByEmail(email)
            .orElseThrow(() -> new RuntimeException("User not found: " + email));
    }
    // ===== END NEW =====

    @Transactional(readOnly = true)
    public List<BlogPostDTO> getAllPublishedPosts() {
        return blogPostRepository.findByPublishedTrueOrderByPublishedAtDesc()
                .stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }
    
    @Transactional(readOnly = true)
    public Optional<BlogPostDTO> getPostById(Long id) {
        return blogPostRepository.findByIdWithTags(id)
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
        List<BlogPost> posts;
        if (publishedOnly) {
            posts = blogPostRepository.findByPublishedTrueOrderByPublishedAtDesc();
        } else {
            posts = blogPostRepository.findAllWithTagsAndAuthor();
        }
        return posts.stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }
    
    @Transactional
    public BlogPostDTO createPost(CreatePostRequest request) {
        BlogPost post = new BlogPost();
        post.setTitle(request.getTitle());
        post.setExcerpt(request.getExcerpt());
        post.setContent(request.getContent());
        post.setEmoji(request.getEmoji());
        post.setCardColorStart(request.getCardColorStart());
        post.setCardColorEnd(request.getCardColorEnd());
        post.setPublished(request.getPublished() != null ? request.getPublished() : false);
        post.setReadTime(request.getReadTime() != null ? request.getReadTime() : 5);

        // Set published date if published
        if (post.getPublished()) {
            post.setPublishedAt(LocalDateTime.now());
        }

        // CHANGED: Get current logged-in user instead of hardcoded ID
        User author = getCurrentUser();
        post.setAuthor(author);

        // Set tags
        if (request.getTagIds() != null && !request.getTagIds().isEmpty()) {
            Set<Tag> tags = new HashSet<>(tagRepository.findAllById(request.getTagIds()));
            post.setTags(tags);
        }

        BlogPost saved = blogPostRepository.save(post);
        return convertToDTO(saved);
    }

    @Transactional
    public Optional<BlogPostDTO> updatePost(@NonNull Long id, CreatePostRequest request) {
        return blogPostRepository.findById(id).map(post -> {
            post.setTitle(request.getTitle());
            post.setExcerpt(request.getExcerpt());
            post.setContent(request.getContent());
            post.setEmoji(request.getEmoji());
            post.setCardColorStart(request.getCardColorStart());
            post.setCardColorEnd(request.getCardColorEnd());
            post.setPublished(request.getPublished() != null ? request.getPublished() : false);
            post.setReadTime(request.getReadTime() != null ? request.getReadTime() : 5);
            
            // Update published date if changing to published
            if (post.getPublished() && post.getPublishedAt() == null) {
                post.setPublishedAt(LocalDateTime.now());
            }
            
            // Update tags
            if (request.getTagIds() != null) {
                Set<Tag> tags = new HashSet<>(tagRepository.findAllById(request.getTagIds()));
                post.setTags(tags);
            }
            
            BlogPost saved = blogPostRepository.save(post);
            return convertToDTO(saved);
        });
    }
    
    @Transactional
    public boolean deletePost(@NonNull Long id) {
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

    @Transactional(readOnly = true)
    public PagedResponse<BlogPostDTO> getAllPublishedPostsPaginated(int page, int size) {
        Pageable pageable = PageRequest.of(page, size, Sort.by("publishedAt").descending());
        Page<BlogPost> postPage = blogPostRepository.findPublishedPosts(pageable);
        
        List<BlogPostDTO> posts = postPage.getContent().stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
        
        return new PagedResponse<>(
                posts,
                postPage.getNumber(),
                postPage.getSize(),
                postPage.getTotalElements(),
                postPage.getTotalPages(),
                postPage.isLast()
        );
    }
}