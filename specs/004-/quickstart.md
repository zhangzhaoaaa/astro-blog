# Quickstart: Blog & Tweet Templates via CLI

## Commands

- Create a blog draft:
  - `npm run blog` (creates src/content/blog/slug(title).md if title provided, else blog.md)
  - Options: --title, --description, --date (YYYY-MM-DD), --tags, --draft

- Create a tweet draft:
  - `npm run twitter` (creates src/content/tweets/twitter.md)
  - Options: --title, --date (YYYY-MM-DD[-HH-mm]), --tags, --draft, --sourceUrl

## Notes
- If the default filename exists, the tool creates blog-1.md / twitter-1.md, etc.
- Dates default to now; ensure correct timezone as needed.
- Frontmatter mirrors current content collections; edit as needed after creation.
- Tweet content placeholder is text-only by design. Commands are non-interactive and will use sensible defaults when flags are omitted.
