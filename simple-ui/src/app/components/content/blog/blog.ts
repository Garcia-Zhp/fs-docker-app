import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { BlogService } from '../../../services/blog-service';
import { BlogPost, Tag, PagedResponse } from '../../../models/blog.models';

@Component({
  selector: 'app-blog',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './blog.html',
  styleUrl: './blog.css'
})
export class Blog implements OnInit {
  posts: BlogPost[] = [];
  availableTags: Tag[] = [];
  selectedTag: string = 'All';
  searchQuery: string = '';
  isLoading: boolean = true;
  Math = Math;

  // Pagination
  currentPage: number = 0;
  pageSize: number = 6;
  totalPages: number = 0;
  totalElements: number = 0;

  constructor(
    private blogService: BlogService,
    private router: Router,
    private cdr: ChangeDetectorRef 
  ) {}

  ngOnInit(): void {
    this.loadPosts();
    this.loadTags();
  }

  loadPosts(): void {
    this.isLoading = true;
    this.blogService.getPostsPaginated(this.currentPage, this.pageSize).subscribe({
      next: (response: PagedResponse<BlogPost>) => {
        this.posts = response.content;
        this.totalPages = response.totalPages;
        this.totalElements = response.totalElements;
        this.isLoading = false;
        this.cdr.detectChanges();
      },
      error: (error) => {
        console.error('Error loading posts:', error);
        this.isLoading = false;
        this.cdr.detectChanges();
      }
    });
  }

  loadTags(): void {
    this.blogService.getAllTags().subscribe({
      next: (tags) => {
        this.availableTags = [{ id: 0, name: 'All', slug: 'all' }, ...tags];
        this.cdr.detectChanges();
      }
    });
  }

  get filteredPosts(): BlogPost[] {
    let filtered = this.posts;

    // Filter by tag
    if (this.selectedTag !== 'All') {
      filtered = filtered.filter(post =>
        post.tags.some(tag => tag.name === this.selectedTag)
      );
    }

    // Filter by search
    if (this.searchQuery.trim()) {
      const query = this.searchQuery.toLowerCase();
      filtered = filtered.filter(post =>
        post.title.toLowerCase().includes(query) ||
        post.excerpt.toLowerCase().includes(query) ||
        post.tags.some(tag => tag.name.toLowerCase().includes(query))
      );
    }

    return filtered;
  }

  filterByTag(tag: string): void {
    this.selectedTag = tag;
    this.currentPage = 0;
    this.loadPosts();
  }

  getCardBackground(post: BlogPost): string {
    if (post.cardColorEnd) {
      return `linear-gradient(135deg, ${post.cardColorStart}, ${post.cardColorEnd})`;
    }
    return post.cardColorStart;
  }

  goToPage(page: number): void {
    if (page >= 0 && page < this.totalPages) {
      this.currentPage = page;
      this.loadPosts();
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }

  nextPage(): void {
    if (this.currentPage < this.totalPages - 1) {
      this.goToPage(this.currentPage + 1);
    }
  }

  previousPage(): void {
    if (this.currentPage > 0) {
      this.goToPage(this.currentPage - 1);
    }
  }

  get pageNumbers(): number[] {
    const pages: number[] = [];
    const maxPagesToShow = 5;
    let startPage = Math.max(0, this.currentPage - Math.floor(maxPagesToShow / 2));
    let endPage = Math.min(this.totalPages - 1, startPage + maxPagesToShow - 1);

    if (endPage - startPage < maxPagesToShow - 1) {
      startPage = Math.max(0, endPage - maxPagesToShow + 1);
    }

    for (let i = startPage; i <= endPage; i++) {
      pages.push(i);
    }

    return pages;
  }
}