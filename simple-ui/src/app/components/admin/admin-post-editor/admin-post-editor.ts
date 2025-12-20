import { Component, OnInit, ChangeDetectorRef, AfterViewInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { BlogService } from '../../../services/blog-service';
import { BlogPost, Tag } from '../../../models/blog.models';
import EasyMDE from 'easymde';

@Component({
  selector: 'app-admin-post-editor',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './admin-post-editor.html',
  styleUrl: './admin-post-editor.css'
})
export class AdminPostEditor implements OnInit, AfterViewInit, OnDestroy {
  isEditMode: boolean = false;
  postId: number | null = null;
  isLoading: boolean = false;
  isSaving: boolean = false;
  
  // Markdown editor instance
  markdownEditor: EasyMDE | null = null;
  
  // Form fields
  title: string = '';
  excerpt: string = '';
  content: string = '';
  emoji: string = '📝';
  cardColorStart: string = '#5a6a6a';
  cardColorEnd: string = '#3a7a7a';
  published: boolean = false;
  readTime: number = 5;
  selectedTagIds: number[] = [];
  
  // Available tags
  availableTags: Tag[] = [];

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private blogService: BlogService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.loadTags();
    
    // Check if we're editing an existing post
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.isEditMode = true;
      this.postId = Number(id);
      this.loadPost(this.postId);
    }
  }

  ngAfterViewInit(): void {
    // Initialize markdown editor after view is ready
    setTimeout(() => {
      this.initializeMarkdownEditor();
    }, 100);
  }

  ngOnDestroy(): void {
    // Clean up editor
    if (this.markdownEditor) {
      this.markdownEditor.toTextArea();
      this.markdownEditor = null;
    }
  }

  initializeMarkdownEditor(): void {
    const textarea = document.getElementById('markdown-editor') as HTMLTextAreaElement;
    if (textarea && !this.markdownEditor) {
      this.markdownEditor = new EasyMDE({
        element: textarea,
        spellChecker: false,
        placeholder: 'Write your post content here using Markdown...',
        toolbar: [
          'bold', 'italic', 'heading', '|',
          'quote', 'unordered-list', 'ordered-list', '|',
          'link', 'image', '|',
          'preview', 'side-by-side', 'fullscreen', '|',
          'guide'
        ],
        status: ['lines', 'words', 'cursor'],
        initialValue: this.content
      });

      // Update content when editor changes
      this.markdownEditor.codemirror.on('change', () => {
        if (this.markdownEditor) {
          this.content = this.markdownEditor.value();
        }
      });
    }
  }

  loadTags(): void {
    this.blogService.getAllTags().subscribe({
      next: (tags) => {
        this.availableTags = tags;
        this.cdr.detectChanges();
      },
      error: (err) => {
        console.error('Error loading tags:', err);
      }
    });
  }

  loadPost(id: number): void {
    this.isLoading = true;
    this.blogService.getPostById(id).subscribe({
      next: (post) => {
        if (post) {
          this.title = post.title;
          this.excerpt = post.excerpt;
          this.content = post.content;
          this.emoji = post.emoji;
          this.cardColorStart = post.cardColorStart;
          this.cardColorEnd = post.cardColorEnd || '';
          this.published = post.published;
          this.readTime = post.readTime;
          this.selectedTagIds = post.tags.map(tag => tag.id);
          
          // Update markdown editor content if it exists
          if (this.markdownEditor) {
            this.markdownEditor.value(this.content);
          }
        }
        this.isLoading = false;
        this.cdr.detectChanges();
      },
      error: (err) => {
        console.error('Error loading post:', err);
        this.isLoading = false;
        this.cdr.detectChanges();
      }
    });
  }

  toggleTag(tagId: number): void {
    const index = this.selectedTagIds.indexOf(tagId);
    if (index > -1) {
      this.selectedTagIds.splice(index, 1);
    } else {
      this.selectedTagIds.push(tagId);
    }
  }

  isTagSelected(tagId: number): boolean {
    return this.selectedTagIds.includes(tagId);
  }

  save(): void {
    if (!this.validateForm()) {
      return;
    }

    this.isSaving = true;

    const postData = {
      title: this.title,
      excerpt: this.excerpt,
      content: this.content,
      emoji: this.emoji,
      cardColorStart: this.cardColorStart,
      cardColorEnd: this.cardColorEnd || null,
      published: this.published,
      readTime: this.readTime,
      tagIds: this.selectedTagIds
    };

    const request = this.isEditMode && this.postId
      ? this.blogService.updatePost(this.postId, postData)
      : this.blogService.createPost(postData);

    request.subscribe({
      next: (post) => {
        console.log('Post saved:', post);
        this.isSaving = false;
        this.router.navigate(['/admin/posts']);
      },
      error: (err) => {
        console.error('Error saving post:', err);
        alert('Failed to save post. Please try again.');
        this.isSaving = false;
        this.cdr.detectChanges();
      }
    });
  }

  validateForm(): boolean {
    if (!this.title.trim()) {
      alert('Title is required');
      return false;
    }
    if (!this.excerpt.trim()) {
      alert('Excerpt is required');
      return false;
    }
    if (!this.content.trim()) {
      alert('Content is required');
      return false;
    }
    return true;
  }

  cancel(): void {
    if (confirm('Discard changes?')) {
      this.router.navigate(['/admin/posts']);
    }
  }
}