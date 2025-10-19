# Data Model: Blog & Tweet Templates

## Entities

### BlogFrontmatter
- author: string (default SITE.author)
- pubDatetime: date (ISO)
- modDatetime: date? (optional/null)
- title: string
- featured: boolean? (optional)
- draft: boolean? (optional)
- tags: string[] (default ["others"]) 
- ogImage: image | string? (optional, size ≥ 1200x630)
- description: string
- canonicalURL: string? (optional)
- minutesRead: string? (optional)
- wordCount: number? (optional)

### TweetFrontmatter
- pubDatetime: string (ISO-like)
- title: string? (optional)
- tags: string[] (default [])
- draft: boolean (default false)
- featured: boolean (default false)
- sourceUrl: string (url)

## Validation
- blog.pubDatetime required; tweet.pubDatetime required
- unique filepath (no overwrite); apply slugify for safe filenames
- defaults applied when omitted

## Relationships
- tags are free-form strings; downstream tag stats rely on trimmed non-empty values
