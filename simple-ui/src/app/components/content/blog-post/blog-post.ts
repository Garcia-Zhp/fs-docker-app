import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { DatePipe } from '@angular/common';
import { BlogService } from '../../../services/blog-service';
import { MarkdownService } from '../../../services/markdown-service';
import { BlogPost } from '../../../models/blog.models';

@Component({
  selector: 'app-blog-post',
  standalone: true,
  imports: [RouterLink, DatePipe],
  templateUrl: './blog-post.html',
  styleUrl: './blog-post.css'
})
export class BlogPostComponent implements OnInit {
  post: BlogPost | null = null;
  renderedContent: string = '';
  isLoading: boolean = true;
  notFound: boolean = false;

  constructor(
    private route: ActivatedRoute,
    private blogService: BlogService,
    private markdownService: MarkdownService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    const id = Number(this.route.snapshot.paramMap.get('id'));
    this.loadPost(id);
  }

  loadPost(id: number): void {
    this.isLoading = true;
    this.blogService.getPostById(id).subscribe({
      next: (post) => {
        if (post) {
          this.post = post;
          this.renderedContent = this.markdownService.renderUnsafe(post.content);
          this.notFound = false;
        } else {
          this.notFound = true;
        }
        this.isLoading = false;
        this.cdr.detectChanges();
      },
      error: (error) => {
        console.error('Error loading post:', error);
        this.notFound = true;
        this.isLoading = false;
        this.cdr.detectChanges();
      }
    });
  }
}