import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { BlogService } from '../../../services/blog-service';
import { Tag } from '../../../models/blog.models';

@Component({
  selector: 'app-admin-tags',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './admin-tags.html',
  styleUrl: './admin-tags.css'
})
export class AdminTags implements OnInit {
  tags: Tag[] = [];
  isLoading: boolean = true;
  isAdding: boolean = false;
  editingTagId: number | null = null;
  
  // Form fields
  newTagName: string = '';
  newTagSlug: string = '';
  editTagName: string = '';
  editTagSlug: string = '';

  constructor(
    private blogService: BlogService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.loadTags();
  }

  loadTags(): void {
    this.isLoading = true;
    this.blogService.getAllTags().subscribe({
      next: (tags) => {
        this.tags = tags;
        this.isLoading = false;
        this.cdr.detectChanges();
      },
      error: (err) => {
        console.error('Error loading tags:', err);
        this.isLoading = false;
        this.cdr.detectChanges();
      }
    });
  }

  startAdd(): void {
    this.isAdding = true;
    this.newTagName = '';
    this.newTagSlug = '';
  }

  cancelAdd(): void {
    this.isAdding = false;
    this.newTagName = '';
    this.newTagSlug = '';
  }

  onNameChange(name: string, isNew: boolean = true): void {
    // Auto-generate slug from name
    const slug = name.toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '');
    
    if (isNew) {
      this.newTagSlug = slug;
    } else {
      this.editTagSlug = slug;
    }
  }

  createTag(): void {
    if (!this.newTagName.trim()) {
      alert('Tag name is required');
      return;
    }

    if (!this.newTagSlug.trim()) {
      alert('Tag slug is required');
      return;
    }

    this.blogService.createTag(this.newTagName, this.newTagSlug).subscribe({
      next: (tag) => {
        console.log('Tag created:', tag);
        this.isAdding = false;
        this.loadTags();
      },
      error: (err) => {
        console.error('Error creating tag:', err);
        alert('Failed to create tag. The slug might already exist.');
      }
    });
  }

  startEdit(tag: Tag): void {
    this.editingTagId = tag.id;
    this.editTagName = tag.name;
    this.editTagSlug = tag.slug;
  }

  cancelEdit(): void {
    this.editingTagId = null;
    this.editTagName = '';
    this.editTagSlug = '';
  }

  saveTag(tagId: number): void {
    if (!this.editTagName.trim()) {
      alert('Tag name is required');
      return;
    }

    if (!this.editTagSlug.trim()) {
      alert('Tag slug is required');
      return;
    }

    this.blogService.updateTag(tagId, this.editTagName, this.editTagSlug).subscribe({
      next: (tag) => {
        console.log('Tag updated:', tag);
        this.editingTagId = null;
        this.loadTags();
      },
      error: (err) => {
        console.error('Error updating tag:', err);
        alert('Failed to update tag. The slug might already exist.');
      }
    });
  }

  deleteTag(tagId: number, tagName: string): void {
    if (confirm(`Are you sure you want to delete "${tagName}"? This will remove it from all posts.`)) {
      this.blogService.deleteTag(tagId).subscribe({
        next: () => {
          console.log('Tag deleted');
          this.loadTags();
        },
        error: (err) => {
          console.error('Error deleting tag:', err);
          alert('Failed to delete tag.');
        }
      });
    }
  }

  isEditing(tagId: number): boolean {
    return this.editingTagId === tagId;
  }
}