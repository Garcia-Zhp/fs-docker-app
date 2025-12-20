export interface BlogPost {
  id: number;
  title: string;
  excerpt: string;
  content: string;
  emoji: string;
  cardColorStart: string;
  cardColorEnd: string | null;
  published: boolean;
  publishedAt: string;
  readTime: number;
  createdAt: string;
  updatedAt: string;
  author: Author;
  tags: Tag[];
}

export interface Author {
  id: number;
  name: string;
  title: string;
  bio: string;
  profilePictureUrl: string;
}

export interface Tag {
  id: number;
  name: string;
  slug: string;
}

export interface SiteContent {
  id: number;
  section: string;
  content: string;
}

export interface PagedResponse<T> {
  content: T[];
  page: number;
  size: number;
  totalElements: number;
  totalPages: number;
  last: boolean;
}