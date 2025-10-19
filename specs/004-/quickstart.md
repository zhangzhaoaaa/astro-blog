# Quickstart: Blog & Tweet Templates via CLI

## Commands

- Create a blog draft:
  - `npm run blog` (creates src/content/blog/blog.md)
  - Options: --title, --description, --date, --tags, --draft

- Create a tweet draft:
  - `npm run twitter` (creates src/content/tweets/twitter.md)
  - Options: --title, --date, --tags, --draft, --sourceUrl

## Notes
- If the default filename exists, the tool creates blog-1.md / twitter-1.md, etc.
- Dates default to now; ensure correct timezone as needed.
- Frontmatter mirrors current content collections; edit as needed after creation.
