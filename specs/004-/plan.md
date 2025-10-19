# Implementation Plan: Blog & Tweet Templates via CLI

**Branch**: `004-` | **Date**: 2025-10-19 | **Spec**: /Users/zeromike/gitcode/astro-blog/specs/004-/spec.md
**Input**: Feature specification from `/specs/004-/spec.md`

**Note**: This template is filled in by the `/speckit.plan` command. See `.specify/templates/commands/plan.md` for the execution workflow.

## Summary

目标：提供两条命令以现有技术栈直接生成内容模板到对应目录。

- 生成博客：`npm run blog`（默认文件名 `blog.md`，落地 `src/content/blog/`）
- 生成推特：`npm run twitter`（默认文件名 `twitter.md`，落地 `src/content/tweets/`）

模板前言区字段遵循现有内容集合 schema；命名唯一、可读、可排序；提供可选参数（标题/描述/日期/标签/draft 等），未提供走默认。

## Technical Context

<!--
  ACTION REQUIRED: Replace the content in this section with the technical details
  for the project. The structure here is presented in advisory capacity to guide
  the iteration process.
-->

**Language/Version**: Node.js + TypeScript（与现有仓库一致）  
**Primary Dependencies**: 无新增强依赖；尽量使用 Node 标准库与现有工具链  
**Storage**: 文件系统（生成 Markdown 文件）  
**Testing**: 轻量脚本自检 + 手工验证；后续可加最小化单测（文件生成与前言区校验）  
**Target Platform**: 开发者本地（macOS zsh），CI 可选  
**Project Type**: 单体前端仓库（Astro）  
**Performance Goals**: 单次生成 < 1s；对构建无显著影响  
**Constraints**: 不新增重量依赖；遵循现有内容 schema 与 slug 规则；命令可幂等  
**Scale/Scope**: 博客/推特高频创建；并发极小（本地）

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

**Beauty-First Design**: 不涉及 UI 呈现；间接提升内容一致性，正向影响体验（通过规范模板）。
**Performance Excellence**: 不影响运行时性能；生成脚本轻量，不增加客户端 JS 体积，符合目标（LCP/INP/CLS 无回归）。
**Content-Centric Architecture**: 显著降低创建成本，提升可维护性与作者体验（通过标准前言区与目录结构）。
**Mobile-First Responsive**: 不涉及前端渲染变更；无负面影响。
**SEO & Discoverability**: 统一前言区字段与命名，有利于 RSS/OG/站内搜索与标签统计。

## Project Structure

### Documentation (this feature)

```
specs/[###-feature]/
├── plan.md              # This file (/speckit.plan command output)
├── research.md          # Phase 0 output (/speckit.plan command)
├── data-model.md        # Phase 1 output (/speckit.plan command)
├── quickstart.md        # Phase 1 output (/speckit.plan command)
├── contracts/           # Phase 1 output (/speckit.plan command)
└── tasks.md             # Phase 2 output (/speckit.tasks command - NOT created by /speckit.plan)
```

### Source Code (repository root)
<!--
  ACTION REQUIRED: Replace the placeholder tree below with the concrete layout
  for this feature. Delete unused options and expand the chosen structure with
  real paths (e.g., apps/admin, packages/something). The delivered plan must
  not include Option labels.
-->

```
scripts/
├── new-blog.(ts|js)        # 生成博客模板
├── new-twitter.(ts|js)     # 生成推特模板

package.json
└── scripts:
  blog    → node scripts/new-blog
  twitter → node scripts/new-twitter
```

**Structure Decision**: 采用单仓脚本方案，最小改动接入；通过 package.json 暴露 `npm run blog`/`npm run twitter`。脚本内部遵循现有 slug 规则与内容 schema。

## Complexity Tracking

*Fill ONLY if Constitution Check has violations that must be justified*

| Violation | Why Needed | Simpler Alternative Rejected Because |
|-----------|------------|-------------------------------------|
| [e.g., 4th project] | [current need] | [why 3 projects insufficient] |
| [e.g., Repository pattern] | [specific problem] | [why direct DB access insufficient] |
