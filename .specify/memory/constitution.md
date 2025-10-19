<!--
  Sync Impact Report:
  Version change: 1.0.0 → 1.1.0
  Modified principles:
    - II. Performance Excellence → clarified metrics (FID→INP), Astro server output & hydration strategy
    - V. SEO & Discoverability Excellence → clarified sitemap, RSS, OG, Chinese labels for breadcrumbs
  Added sections:
    - Governance: Versioning policy elaboration (SemVer for constitution), PR compliance checklist
  Removed sections:
    - None
  Templates requiring updates:
    ✅ Updated: .specify/templates/plan-template.md (Constitution Check wording aligned)
    ✅ Updated: .specify/templates/spec-template.md (mandatory sections unchanged; no update required)
    ✅ Updated: .specify/templates/tasks-template.md (no constitution coupling; left as-is)
  Follow-up TODOs:
    - TODO(RATIFICATION_DATE): If original adoption pre-dates 2025-10-13, replace with true date
-->

# Astro Blog System Constitution

## Core Principles

### I. Beauty-First Design
Every visual element MUST prioritize aesthetic appeal and user experience. Design decisions are evaluated first by beauty, second by functionality. Typography, spacing, color schemes, and animations must create an delightful reading experience that encourages engagement and return visits.

**Rationale**: A beautiful blog system differentiates itself in a crowded content landscape and creates emotional connection with readers.

### II. Performance Excellence (NON-NEGOTIABLE)
Core Web Vitals MUST meet or exceed "Good" thresholds: LCP < 2.5s, INP < 200ms, CLS < 0.1. Prefer static generation, but when server output is required, ensure critical paths are optimized: preload LCP images/fonts, minimize JavaScript, defer hydration (e.g., client:idle/visible), and dedupe frameworks. Lighthouse composite scores SHOULD remain ≥ 95.

**Rationale**: Performance directly impacts user experience, SEO rankings, and content accessibility.

### III. Content-Centric Architecture
The content creation and management experience must be frictionless. Markdown-first authoring with zero-config publishing. Support for rich media, code syntax highlighting, table of contents, and reading time estimates. Content structure must be semantic and accessible.

**Rationale**: Great content is the foundation of any successful blog system.

### IV. Mobile-First Responsive Design
All features must work flawlessly on mobile devices first, then scale up to desktop. Touch targets must be appropriately sized, text readable without zoom, and navigation intuitive on small screens. Dark mode support is mandatory.

**Rationale**: Mobile traffic dominates modern web usage patterns.

### V. SEO & Discoverability Excellence
Every page MUST generate semantic HTML, structured data, optimized meta tags, and OG/Twitter cards. RSS feeds and sitemaps MUST be present and valid. Search MUST be fast and typo-tolerant. Breadcrumbs SHOULD use localized labels (e.g., Chinese for tweets/podcasts). URLs MUST be clean and meaningful.

**Rationale**: Content discovery and search engine optimization are critical for blog success.

## Performance Standards

- **Load Time**: Initial page load < 1.5 seconds on 3G networks
- **Build Time**: Full site build < 60 seconds for 100+ posts
- **Image Optimization**: WebP format with responsive sizing required
- **Accessibility**: WCAG 2.1 AA compliance mandatory
- **Bundle Size**: JavaScript bundles < 50KB gzipped

## Content Quality Standards

- **Typography**: Consistent type scale with optimal line height and measure
- **Code Blocks**: Syntax highlighting with copy functionality
- **Media**: All images must include alt text and appropriate sizing
- **Navigation**: Breadcrumbs, pagination, and related posts required
- **Search**: Fast, typo-tolerant fuzzy search implementation

## Governance

This constitution supersedes other development practices. All feature additions, design changes, and content updates MUST align with these principles.

**Amendment Process**: Propose changes via PR with a clear rationale tied to UX impact and evidence (metrics, accessibility reports). Breaking changes to core principles require MAJOR version increment; additions/expansions require MINOR; clarifications/typos use PATCH.

**Compliance Review**: Each PR MUST include a Constitution Check confirming: Beauty-First, Performance targets (LCP/INP/CLS), Content-Centric authoring, Mobile-First, SEO/Discoverability. Include automated checks for performance and accessibility when feasible.

**Version**: 1.1.0 | **Ratified**: TODO(RATIFICATION_DATE): original adoption date unknown | **Last Amended**: 2025-10-19