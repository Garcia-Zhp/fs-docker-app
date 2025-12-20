import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { BlogPost, Tag, SiteContent, PagedResponse } from '../models/blog.models';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class BlogService {
  private http = inject(HttpClient);
    private apiUrl = environment.apiUrl; 

  // Fetch all published blog posts
  getAllPosts(): Observable<BlogPost[]> {
    return this.http.get<BlogPost[]>(`${this.apiUrl}/blog/posts`)
      .pipe(
        catchError((error: HttpErrorResponse) => {
          console.error('Error fetching posts:', error);
          return of([]);
        })
      );
  }

  // Fetch single blog post by ID
  getPostById(id: number): Observable<BlogPost | null> {
    return this.http.get<BlogPost>(`${this.apiUrl}/blog/posts/${id}`)
      .pipe(
        catchError((error: HttpErrorResponse) => {
          console.error('Error fetching post:', error);
          return of(null);
        })
      );
  }

  // Search posts
  searchPosts(query: string): Observable<BlogPost[]> {
    return this.http.get<BlogPost[]>(`${this.apiUrl}/blog/posts/search`, {
      params: { query }
    })
      .pipe(
        catchError((error: HttpErrorResponse) => {
          console.error('Error searching posts:', error);
          return of([]);
        })
      );
  }

  // Get posts by tag
  getPostsByTag(tagSlug: string): Observable<BlogPost[]> {
    return this.http.get<BlogPost[]>(`${this.apiUrl}/blog/posts/tag/${tagSlug}`)
      .pipe(
        catchError((error: HttpErrorResponse) => {
          console.error('Error fetching posts by tag:', error);
          return of([]);
        })
      );
  }

  // Fetch all tags
  getAllTags(): Observable<Tag[]> {
    return this.http.get<Tag[]>(`${this.apiUrl}/tags`)
      .pipe(
        catchError((error: HttpErrorResponse) => {
          console.error('Error fetching tags:', error);
          return of([]);
        })
      );
  }

  // Fetch site content by section
  getSiteContent(section: string): Observable<SiteContent | null> {
    return this.http.get<SiteContent>(`${this.apiUrl}/content/${section}`)
      .pipe(
        catchError((error: HttpErrorResponse) => {
          console.error('Error fetching site content:', error);
          return of(null);
        })
      );
  }

  // Fetch all site content
  getAllSiteContent(): Observable<SiteContent[]> {
    return this.http.get<SiteContent[]>(`${this.apiUrl}/content`)
      .pipe(
        catchError((error: HttpErrorResponse) => {
          console.error('Error fetching all site content:', error);
          return of([]);
        })
      );
  }

    // Admin methods
  createPost(post: any): Observable<BlogPost> {
    return this.http.post<BlogPost>(`${this.apiUrl}/blog/admin/posts`, post);
  }

  updatePost(id: number, post: any): Observable<BlogPost> {
    return this.http.put<BlogPost>(`${this.apiUrl}/blog/admin/posts/${id}`, post);
  }

  deletePost(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/blog/admin/posts/${id}`);
  }

  getAllPostsAdmin(): Observable<BlogPost[]> {
    return this.http.get<BlogPost[]>(`${this.apiUrl}/blog/admin/posts`).pipe(
      catchError(error => {
        console.error('Error fetching admin posts:', error);
        return of([]);
      })
    );
  }

  updateSiteContent(section: string, content: string): Observable<any> {
    return this.http.post(`${this.apiUrl}/content/admin`, { section, content });
  }

    // Tag management methods
  createTag(name: string, slug: string): Observable<Tag> {
    return this.http.post<Tag>(`${this.apiUrl}/tags/admin`, { name, slug });
  }

  updateTag(id: number, name: string, slug: string): Observable<Tag> {
    return this.http.put<Tag>(`${this.apiUrl}/tags/admin/${id}`, { name, slug });
  }

  deleteTag(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/tags/admin/${id}`);
  }

  getPostsPaginated(page: number = 0, size: number = 6): Observable<PagedResponse<BlogPost>> {
  return this.http.get<PagedResponse<BlogPost>>(`${this.apiUrl}/blog/posts/paginated?page=${page}&size=${size}`).pipe(
    catchError(error => {
      console.error('Error fetching paginated posts:', error);
      return of({ content: [], page: 0, size: 0, totalElements: 0, totalPages: 0, last: true });
    })
  );
}
}