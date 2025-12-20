import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { BlogService } from '../../../services/blog-service';
import { BlogPost } from '../../../models/blog.models';

@Component({
  selector: 'app-admin-posts',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './admin-posts.html',
  styleUrl: './admin-posts.css'
})
export class AdminPosts implements OnInit {
  posts: BlogPost[] = [];
  isLoading: boolean = true;

  constructor(
    private blogService: BlogService,
    private router: Router,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.loadPosts();
  }

  loadPosts(): void {
    this.isLoading = true;
    this.blogService.getAllPostsAdmin().subscribe({
      next: (posts) => {
        this.posts = posts;
        this.isLoading = false;
        this.cdr.detectChanges();
      },
      error: (err) => {
        console.error('Error loading posts:', err);
        this.isLoading = false;
        this.cdr.detectChanges();
      }
    });
  }

  editPost(id: number): void {
    this.router.navigate(['/admin/posts/edit', id]);
  }

  deletePost(id: number, title: string): void {
    if (confirm(`Are you sure you want to delete "${title}"?`)) {
      this.blogService.deletePost(id).subscribe({
        next: () => {
          console.log('Post deleted');
          this.loadPosts(); // Reload the list
        },
        error: (err) => {
          console.error('Error deleting post:', err);
          alert('Failed to delete post');
        }
      });
    }
  }

  createNew(): void {
    this.router.navigate(['/admin/posts/create']);
  }
}