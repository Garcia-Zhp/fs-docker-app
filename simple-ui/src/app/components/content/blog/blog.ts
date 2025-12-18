import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';

interface BlogPost {
  id: number;
  title: string;
  excerpt: string;
  date: string;
  readTime: string;
  tags: string[];
  emoji: string;
  featured?: boolean;
}

@Component({
  selector: 'app-blog',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './blog.html',
  styleUrl: './blog.css'
})
export class Blog {
  searchQuery: string = '';
  selectedTag: string = 'All';

  allPosts: BlogPost[] = [
    {
      id: 1,
      title: 'Lessons from Migrating PostgreSQL: A Database Migration Story',
      excerpt: 'Leading a PostgreSQL migration for business-critical applications taught me valuable lessons about database refactoring, API design, and zero-downtime deployments. Here\'s what I learned from reducing our licensing costs while achieving zero P1/P2/P3 incidents post-launch.',
      date: 'December 15, 2024',
      readTime: '8 min read',
      tags: ['PostgreSQL', 'Database Migration', 'System Design'],
      emoji: '📝',
      featured: true
    },
    {
      id: 2,
      title: 'Optimizing Spring Boot Performance: Real-World Examples',
      excerpt: 'How I achieved 90% performance improvements on critical endpoints through SQL optimization and strategic caching strategies.',
      date: 'December 10, 2024',
      readTime: '5 min read',
      tags: ['Spring Boot', 'Performance', 'Java'],
      emoji: '🔧'
    },
    {
      id: 3,
      title: 'Building Workflow Automation with ServiceNow',
      excerpt: 'Automating 75% of manual server requests using ServiceNow Flow Designer and exploring integration patterns that scale.',
      date: 'December 5, 2024',
      readTime: '6 min read',
      tags: ['ServiceNow', 'Automation', 'Integration'],
      emoji: '🤖'
    },
    {
      id: 4,
      title: 'From PCF to Kubernetes: Platform Migration Insights',
      excerpt: 'Configuring Dockerfiles and Kubernetes manifests for 10+ microservices during a major platform migration.',
      date: 'November 28, 2024',
      readTime: '7 min read',
      tags: ['Kubernetes', 'Docker', 'DevOps'],
      emoji: '🐳'
    },
    {
      id: 5,
      title: 'Test-Driven Development in Enterprise Applications',
      excerpt: 'Maintaining 80%+ code coverage with JUnit and Mockito while keeping tests maintainable and valuable.',
      date: 'November 20, 2024',
      readTime: '4 min read',
      tags: ['Testing', 'TDD', 'Best Practices'],
      emoji: '🎯'
    },
    {
      id: 6,
      title: 'Angular Component Design Patterns',
      excerpt: 'Building reusable, maintainable Angular components for enterprise-scale applications with real examples.',
      date: 'November 15, 2024',
      readTime: '5 min read',
      tags: ['Angular', 'Frontend', 'Design Patterns'],
      emoji: '💡'
    }
  ];

  availableTags: string[] = ['All', 'Java', 'Angular', 'System Design', 'DevOps'];

  get filteredPosts(): BlogPost[] {
    return this.allPosts.filter(post => {
      const matchesSearch = this.searchQuery === '' || 
        post.title.toLowerCase().includes(this.searchQuery.toLowerCase()) ||
        post.excerpt.toLowerCase().includes(this.searchQuery.toLowerCase()) ||
        post.tags.some(tag => tag.toLowerCase().includes(this.searchQuery.toLowerCase()));

      const matchesTag = this.selectedTag === 'All' || 
        post.tags.some(tag => 
          tag.toLowerCase().includes(this.selectedTag.toLowerCase())
        );

      return matchesSearch && matchesTag;
    });
  }

  selectTag(tag: string): void {
    this.selectedTag = tag;
  }

  isTagActive(tag: string): boolean {
    return this.selectedTag === tag;
  }
}