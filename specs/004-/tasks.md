---
description: "Task list for Blog & Tweet Templates via CLI"
---

# Tasks: Blog & Tweet Templates via CLI

**Input**: Design documents from `/specs/004-/`
**Prerequisites**: plan.md (assumed), spec.md (user stories), research.md, data-model.md, contracts/commands.md, quickstart.md

## Format: `[ID] [P?] [Story] Description`

## Phase 1: Setup (Shared Infrastructure)

- [ ] T001 [P] Setup scripts directory `scripts/` (create if missing)
- [ ] T002 [P] Add `npm run blog` and `npm run twitter` scripts to `package.json`
- [ ] T003 [P] Utility: create `scripts/_utils.(ts|js)` with helpers (safeWriteFile, slugifyFilename via existing utils, ensureDir)

---

## Phase 2: Foundational (Blocking Prerequisites)

**⚠️ CRITICAL**: 完成后方可开始任一用户故事

- [ ] T004 Wire existing slugify util into scripts（`src/utils/slugify.ts` 导出的方法）
- [ ] T005 Validate frontmatter keys against content schemas（blog/tweets）
- [ ] T006 Define dedupe strategy for default filenames（`blog.md`→`blog-1.md` 递增；`twitter.md` 同理）

---

## Phase 3: User Story 1 - 通过命令创建“博客”模板 (Priority: P1) 🎯 MVP

**Goal**: 生成 `src/content/blog/blog.md`（必要时去重），写入与 blog 集合一致的前言区与正文占位

**Independent Test**: 执行 `npm run blog` 后，生成文件路径打印；前言区通过内容校验；可直接写作

### Implementation for User Story 1

- [ ] T007 [US1] Create `scripts/new-blog.(ts|js)` 脚本入口
- [ ] T008 [US1] Parse CLI params：--title --description --date --tags --draft
- [ ] T009 [US1] 计算落地目录 `src/content/blog/` 与默认文件名 `blog.md`
- [ ] T010 [US1] 生成前言区：author(SITE.author)、pubDatetime、modDatetime?、title、featured?、draft?、tags 默认、ogImage?、description、canonicalURL?、minutesRead?、wordCount?
- [ ] T011 [US1] 写入正文占位（标题/小节/备注）
- [ ] T012 [US1] 写入文件并输出绝对路径；若存在则去重命名
- [ ] T013 [US1] 错误处理与友好提示（权限/无效日期等）

**Checkpoint**: US1 完整可独立演示

---

## Phase 4: User Story 2 - 通过命令创建“推特”模板 (Priority: P1)

**Goal**: 生成 `src/content/tweets/twitter.md`（必要时去重），写入与 tweets 集合一致的前言区与内容占位（文本+图片注释占位）

**Independent Test**: 执行 `npm run twitter` 后，生成文件路径打印；前言区通过内容校验；渲染通过

### Implementation for User Story 2

- [ ] T014 [US2] Create `scripts/new-twitter.(ts|js)` 脚本入口
- [ ] T015 [US2] Parse CLI params：--title --date --tags --draft --sourceUrl
- [ ] T016 [US2] 计算落地目录 `src/content/tweets/` 与默认文件名 `twitter.md`
- [ ] T017 [US2] 生成前言区：pubDatetime、title?、tags 默认、draft 默认 false、featured 默认 false、sourceUrl（占位/校验）
- [ ] T018 [US2] 写入正文占位（文本段，图片占位注释）
- [ ] T019 [US2] 写入文件并输出绝对路径；若存在则去重命名
- [ ] T020 [US2] 错误处理与友好提示（权限/无效日期/无效 URL）

**Checkpoint**: US2 完整可独立演示

---

## Phase 5: User Story 3 - 统一命名与路径规范 (Priority: P2)

**Goal**: 文件名/路径/字段一致性与可配置性到位

**Independent Test**: 多次快速创建不覆盖；特殊标题生成有效 slug；目录结构稳定

### Implementation for User Story 3

- [ ] T021 [US3] 提供 `--dir` 与 `--filename` 覆盖（可选），默认仍为 blog.md / twitter.md
- [ ] T022 [US3] 标题→slug 转换与非法字符清理（复用现有 slugify）
- [ ] T023 [US3] 冲突时自动追加 `-1`, `-2`…（与 T006 策略一致）
- [ ] T024 [US3] 输出最终文件路径与所用默认/覆盖项摘要

**Checkpoint**: US3 完整可独立演示

---

## Phase N: Polish & Cross-Cutting

- [ ] T025 [P] README 片段：在 `specs/004-/quickstart.md` 基础上补充根 README“内容模板命令”小节
- [ ] T026 统一提示文案与本地化（中/英）
- [ ] T027 轻量自检：脚本 dry-run 模式（仅打印即将创建的路径与前言区），避免误写

---

## Dependencies & Execution Order

- Phase 1 → Phase 2 → US1(P1) → US2(P1) → US3(P2) → Polish
- 关键依赖：T004、T005、T006 完成后方可进行 US1/US2

### Parallel Opportunities

- T001–T003 可并行
- US1 内：解析参数/前言区构造/写入逻辑可在不同模块并行开发（不同文件）
- US2 同理

---

## Implementation Strategy

- MVP：完成 US1（博客命令）即可交付最小可用价值
- 增量：US2（推特）、US3（命名与配置拓展）
