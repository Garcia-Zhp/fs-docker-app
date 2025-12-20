import { Injectable } from '@angular/core';
import { marked } from 'marked';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';

@Injectable({
  providedIn: 'root'
})
export class MarkdownService {
  constructor(private sanitizer: DomSanitizer) {
    // Configure marked options
    marked.setOptions({
      breaks: true,
      gfm: true
    });
  }

  render(markdown: string): SafeHtml {
    const html = marked.parse(markdown);
    return this.sanitizer.sanitize(1, html) || '';
  }

  renderUnsafe(markdown: string): string {
    return marked.parse(markdown) as string;
  }
}