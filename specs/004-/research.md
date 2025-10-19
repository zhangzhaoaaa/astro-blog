# Research: Blog & Tweet Templates via CLI

## Decisions

- Blog/Tweet frontmatter aligns with existing content collections (from src/content/config.ts)
- Commands: `npm run blog` → create blog.md in src/content/blog/; `npm run twitter` → create twitter.md in src/content/tweets/
- Defaults: When fields omitted, use schema defaults (e.g., SITE.author, tags, draft=false) and current date for pubDatetime
- CLI Style: 参数优先；无参时走交互式（最少问题）
- Twitter placeholders: 仅文本占位

## Rationale

- 对齐现有 schema 可避免渲染与构建调整；保持数据面一致性
- 通过 package.json 脚本，零额外依赖；降低接入/维护成本
- 参数优先便于自动化，交互兜底更友好
- 用户明确仅需文本，占位更轻量，降低心智负担

## Alternatives Considered

- 图文推特模板：可在未来作为可选扩展，但当前保持最小可行（仅文本）
- 单一交互式：易用但不利于自动化批量生成
- 引入脚手架库（如 plop）：增加依赖与维护成本，超出本需求最小化范围
