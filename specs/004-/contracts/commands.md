# Contracts: CLI Commands for Templates

## Commands

### Create Blog Template
- Name: npm run blog
- Behavior: Create a new Markdown file at src/content/blog/
- Default filename: slug(title).md if title provided, otherwise blog.md (dedupe to -1, -2 … if exists)
- Output: absolute path printed to stdout
- Params (optional):
  - --title "..."
  - --description "..."
  - --date YYYY-MM-DD or YYYY-MM-DD-HH-mm
  - --tags tag1,tag2
  - --draft true|false

### Create Twitter Template
- Name: npm run twitter
- Behavior: Create a new Markdown file at src/content/tweets/
- Default filename: twitter.md (dedupe to twitter-1.md, twitter-2.md … if exists); filename does not include date, date is inside frontmatter (pubDatetime)
- Output: absolute path printed to stdout
- Params (optional):
  - --title "..."
  - --date YYYY-MM-DD or YYYY-MM-DD-HH-mm
  - --tags tag1,tag2
  - --draft true|false
  - --sourceUrl https://...

## Error Cases
- Directory not writable → exit non-zero, print guidance
- Filename conflict → always dedupe; never overwrite
- Invalid date → fallback to now; warn user
- Invalid URL (twitter) → create with placeholder and warn
