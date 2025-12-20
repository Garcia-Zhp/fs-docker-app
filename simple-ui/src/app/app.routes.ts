import { Routes } from '@angular/router';
import { About } from './components/content/about/about';
import { Contact } from './components/content/contact/contact';
import { Resume } from './components/content/resume/resume';
import { Blog } from './components/content/blog/blog';
import { BlogPostComponent } from './components/content/blog-post/blog-post';
import { AuthCallback } from './components/auth-callback/auth-callback';
import { AdminDashboard } from './components/admin-dashboard/admin-dashboard';
import { AdminLogin } from './components/admin-login/admin-login';
import { AdminPosts } from './components/admin/admin-posts/admin-posts';
import { AdminPostEditor } from './components/admin/admin-post-editor/admin-post-editor';
import { AdminSiteContent } from './components/admin/admin-site-content/admin-site-content';
import { AdminTags } from './components/admin/admin-tags/admin-tags';

export const routes: Routes = [
  { path: '', redirectTo: 'about', pathMatch: 'full' },
  { path: 'about', component: About },
  { path: 'contact', component: Contact },
  { path: 'resume', component: Resume },
  { path: 'blog', component: Blog },
  { path: 'blog/:id', component: BlogPostComponent },
  { path: 'auth/callback', component: AuthCallback },
  { path: 'admin', component: AdminLogin },
  { path: 'admin/dashboard', component: AdminDashboard },
  { path: 'admin/posts', component: AdminPosts },
  { path: 'admin/posts/create', component: AdminPostEditor },
  { path: 'admin/posts/edit/:id', component: AdminPostEditor },
  { path: 'admin/content', component: AdminSiteContent },
    { path: 'admin/tags', component: AdminTags }
];