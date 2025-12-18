import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterLink } from '@angular/router';

interface BlogPostData {
  id: number;
  title: string;
  excerpt: string;
  content: string;
  date: string;
  readTime: string;
  tags: string[];
  emoji: string;
  author: string;
}

@Component({
  selector: 'app-blog-post',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './blog-post.html',
  styleUrl: './blog-post.css'
})
export class BlogPost implements OnInit {
  post: BlogPostData | null = null;

  allPosts: BlogPostData[] = [
    {
      id: 1,
      title: 'Lessons from Migrating PostgreSQL: A Database Migration Story',
      excerpt: 'Leading a PostgreSQL migration for business-critical applications taught me valuable lessons about database refactoring, API design, and zero-downtime deployments.',
      content: `
        <h2>The Challenge</h2>
        <p>When tasked with migrating multiple business-critical applications from Oracle to PostgreSQL, I quickly realized this wasn't just a database switch—it was an opportunity to fundamentally improve our architecture.</p>

        <h2>The Approach</h2>
        <p>Rather than attempting a direct migration, I took a strategic approach that focused on decoupling services and establishing clear API boundaries. Here's what worked:</p>

        <h3>1. Refactoring Cross-Database Queries</h3>
        <p>I identified 20+ complex queries that spanned multiple databases. Instead of trying to replicate this in PostgreSQL, I refactored each into dedicated Java APIs. This had multiple benefits:</p>
        <ul>
          <li>Services became truly independent</li>
          <li>We could refactor schemas without breaking downstream consumers</li>
          <li>Performance improved through targeted optimization</li>
        </ul>

        <h3>2. SQL Optimization</h3>
        <p>During the migration, I discovered critical performance bottlenecks. By optimizing queries and adding proper indexes, I achieved up to 90% speed improvements on key endpoints. One particularly problematic query went from 60 seconds to just 5 seconds.</p>

        <h3>3. Data Integrity Validation</h3>
        <p>Before going live, I implemented comprehensive data validation checks to ensure zero data loss during migration. This gave the business confidence to proceed with the cutover.</p>

        <h2>The Results</h2>
        <p>The migration was a complete success:</p>
        <ul>
          <li>Zero P1/P2/P3 incidents post-launch</li>
          <li>Significant reduction in annual licensing costs</li>
          <li>Improved application performance across the board</li>
          <li>Better architectural patterns for future development</li>
        </ul>

        <h2>Key Takeaways</h2>
        <p>Database migrations are opportunities for improvement, not just technical hurdles. By focusing on architecture, performance, and data integrity, you can turn a migration into a catalyst for positive change.</p>
      `,
      date: 'December 15, 2024',
      readTime: '8 min read',
      tags: ['PostgreSQL', 'Database Migration', 'System Design'],
      emoji: '📝',
      author: 'Jaime Garcia'
    },
    {
      id: 2,
      title: 'Optimizing Spring Boot Performance: Real-World Examples',
      excerpt: 'How I achieved 90% performance improvements on critical endpoints through SQL optimization and strategic caching strategies.',
      content: `
        <h2>Introduction</h2>
        <p>Performance optimization in Spring Boot applications often comes down to understanding where bottlenecks exist and addressing them systematically.</p>

        <h2>Identifying the Problem</h2>
        <p>Using application monitoring and profiling tools, I identified several slow endpoints that were impacting user experience.</p>

        <h2>Solutions Implemented</h2>
        <p>Through a combination of SQL optimization, caching strategies, and connection pool tuning, I was able to achieve significant performance gains.</p>
      `,
      date: 'December 10, 2024',
      readTime: '5 min read',
      tags: ['Spring Boot', 'Performance', 'Java'],
      emoji: '🔧',
      author: 'Jaime Garcia'
    },
    {
      id: 3,
      title: 'Building Workflow Automation with ServiceNow',
      excerpt: 'Automating 75% of manual server requests using ServiceNow Flow Designer and exploring integration patterns that scale.',
      content: `
        <h2>The Challenge</h2>
        <p>Manual server provisioning was taking 10-40 days, creating bottlenecks for development teams.</p>

        <h2>The Solution</h2>
        <p>By integrating ServiceNow with Ansible Automation Platform and CMDB, we automated the entire workflow.</p>

        <h2>Results</h2>
        <p>Server provisioning time reduced to under 1 day with 75% automation rate.</p>
      `,
      date: 'December 5, 2024',
      readTime: '6 min read',
      tags: ['ServiceNow', 'Automation', 'Integration'],
      emoji: '🤖',
      author: 'Jaime Garcia'
    },
    {
      id: 4,
      title: 'From PCF to Kubernetes: Platform Migration Insights',
      excerpt: 'Configuring Dockerfiles and Kubernetes manifests for 10+ microservices during a major platform migration.',
      content: `
        <h2>Migration Overview</h2>
        <p>Moving from Pivotal Cloud Foundry to Kubernetes required careful planning and execution.</p>

        <h2>Key Learnings</h2>
        <p>Containerization, orchestration, and zero-downtime deployments were critical to success.</p>
      `,
      date: 'November 28, 2024',
      readTime: '7 min read',
      tags: ['Kubernetes', 'Docker', 'DevOps'],
      emoji: '🐳',
      author: 'Jaime Garcia'
    },
    {
      id: 5,
      title: 'Test-Driven Development in Enterprise Applications',
      excerpt: 'Maintaining 80%+ code coverage with JUnit and Mockito while keeping tests maintainable and valuable.',
      content: `
        <h2>The Importance of Testing</h2>
        <p>High-quality tests provide confidence in refactoring and prevent regressions.</p>

        <h2>Best Practices</h2>
        <p>Focus on meaningful tests, not just coverage numbers.</p>
      `,
      date: 'November 20, 2024',
      readTime: '4 min read',
      tags: ['Testing', 'TDD', 'Best Practices'],
      emoji: '🎯',
      author: 'Jaime Garcia'
    },
    {
      id: 6,
      title: 'Angular Component Design Patterns',
      excerpt: 'Building reusable, maintainable Angular components for enterprise-scale applications with real examples.',
      content: `
        <h2>Component Architecture</h2>
        <p>Good component design is the foundation of maintainable Angular applications.</p>

        <h2>Key Patterns</h2>
        <p>Smart/dumb components, state management, and reusability principles.</p>
      `,
      date: 'November 15, 2024',
      readTime: '5 min read',
      tags: ['Angular', 'Frontend', 'Design Patterns'],
      emoji: '💡',
      author: 'Jaime Garcia'
    }
  ];

  constructor(private route: ActivatedRoute) {}

  ngOnInit(): void {
    const id = Number(this.route.snapshot.paramMap.get('id'));
    this.post = this.allPosts.find(p => p.id === id) || null;
  }
}