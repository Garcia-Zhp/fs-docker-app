import { Routes } from '@angular/router';
import { About } from './components/content/about/about';
import { Contact } from './components/content/contact/contact';
import { Resume } from './components/content/resume/resume';
import { Blog } from './components/content/blog/blog';
import { BlogPost } from './components/content/blog-post/blog-post';

export const routes: Routes = [
  { path: '', redirectTo: 'about', pathMatch: 'full' },
  { path: 'about', component: About },
  { path: 'contact', component: Contact },
  { path: 'resume', component: Resume },
  { path: 'blog', component: Blog },
  { path: 'blog/:id', component: BlogPost }
];