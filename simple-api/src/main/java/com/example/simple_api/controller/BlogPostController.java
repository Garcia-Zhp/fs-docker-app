package com.example.simple_api.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.lang.NonNull;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.example.simple_api.dto.BlogPostDTO;
import com.example.simple_api.dto.CreatePostRequest;
import com.example.simple_api.dto.PagedResponse;
import com.example.simple_api.service.BlogPostService;

@RestController
@RequestMapping("/api/blog")
@CrossOrigin(origins = "http://localhost:4200")
public class BlogPostController {
    
    @Autowired
    private BlogPostService blogPostService;
    
    @GetMapping("/posts")
    public ResponseEntity<List<BlogPostDTO>> getAllPublishedPosts() {
        List<BlogPostDTO> posts = blogPostService.getAllPublishedPosts();
        return ResponseEntity.ok(posts);
    }
    
    @GetMapping("/posts/{id}")
    public ResponseEntity<BlogPostDTO> getPostById(@PathVariable Long id) {
        return blogPostService.getPostById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }
    
    @GetMapping("/posts/tag/{tagSlug}")
    public ResponseEntity<List<BlogPostDTO>> getPostsByTag(@PathVariable String tagSlug) {
        List<BlogPostDTO> posts = blogPostService.getPostsByTag(tagSlug);
        return ResponseEntity.ok(posts);
    }
    
    @GetMapping("/posts/search")
    public ResponseEntity<List<BlogPostDTO>> searchPosts(@RequestParam String query) {
        List<BlogPostDTO> posts = blogPostService.searchPosts(query);
        return ResponseEntity.ok(posts);
    }
    
    // Admin endpoints (we'll secure these later with OAuth)
    @GetMapping("/admin/posts")
    public ResponseEntity<List<BlogPostDTO>> getAllPosts(
            @RequestParam(defaultValue = "false") boolean publishedOnly) {
        List<BlogPostDTO> posts = blogPostService.getAllPosts(publishedOnly);
        return ResponseEntity.ok(posts);
    }
    @PostMapping("/admin/posts")
    public ResponseEntity<BlogPostDTO> createPost(@RequestBody CreatePostRequest request) {
        BlogPostDTO created = blogPostService.createPost(request);
        return ResponseEntity.ok(created);
    }

    @PutMapping("/admin/posts/{id}")
    public ResponseEntity<BlogPostDTO> updatePost(
            @PathVariable Long id, 
            @RequestBody CreatePostRequest request) {
        return blogPostService.updatePost(id, request)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }
    
    @DeleteMapping("/admin/posts/{id}")
    public ResponseEntity<Void> deletePost(@NonNull @PathVariable Long id) {
        boolean deleted = blogPostService.deletePost(id);
        return deleted ? ResponseEntity.noContent().build() : ResponseEntity.notFound().build();
    }

    @GetMapping("/posts/paginated")
public ResponseEntity<PagedResponse<BlogPostDTO>> getPublishedPostsPaginated(
        @RequestParam(defaultValue = "0") int page,
        @RequestParam(defaultValue = "6") int size) {
    PagedResponse<BlogPostDTO> posts = blogPostService.getAllPublishedPostsPaginated(page, size);
    return ResponseEntity.ok(posts);
}
}