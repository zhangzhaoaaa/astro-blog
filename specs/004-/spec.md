# Feature Specification: Blog & Tweet Templates via CLI

**Feature Branch**: `[004-]`  
**Created**: 2025-10-19  
**Status**: Draft  
**Input**: User description: "实现两个模版：一个博客、一个推特；通过命令直接在对应目录生成新内容"

## User Scenarios & Testing *(mandatory)*

### User Story 1 - 通过命令创建“博客”模板 (Priority: P1)

用户希望通过一条命令创建一篇新的博客草稿，自动落在博客目录中，并带有预置的前言区（标题、日期、标签、描述等）与正文结构提示。

**Why this priority**: 博客是网站的主要内容，模板化能大幅降低创建成本与格式错误，提升产出效率。

**Independent Test**: 执行创建命令后，目标目录出现新文件，前言区字段完整、命名规范且内容可被系统识别，打开即能开始写作。

**Acceptance Scenarios**:

1. Given 没有同名文件，When 运行“新建博客模板”命令，Then 在博客目录生成一个带前言区和正文提示的 Markdown 文件，文件名符合命名规范。
2. Given 同名冲突，When 运行命令，Then 自动在文件名后附加去重后缀或时间戳，避免覆盖。
3. Given 未提供标题，When 运行命令，Then 使用默认标题并在前言区标注“待填写”。

---

### User Story 2 - 通过命令创建“推特”模板 (Priority: P1)

用户希望通过一条命令创建一条新的“推特”短内容草稿，自动落在推特目录中，并带有前言区（日期、标签、可选标题）与内容占位。

**Why this priority**: 推特短内容更新频次高，模板化能提高一致性与发布速度。

**Independent Test**: 执行创建命令后，目标目录出现新文件，字段完整可识别，可直接填写内容并被站点正常收录/渲染。

**Acceptance Scenarios**:

1. Given 目录可写，When 运行“新建推特模板”命令，Then 在推特目录生成新 Markdown 文件，包含日期与内容占位。
2. Given 未指定日期，When 运行命令，Then 使用当前日期作为默认值且文件名含日期信息，便于归档排序。
3. Given 标签为空，When 运行命令，Then 生成空数组字段但不阻塞创建。

---

### User Story 3 - 统一命名与路径规范 (Priority: P2)

命令生成的文件应符合统一的命名及目录规范，便于归档、查询和自动化处理。

**Independent Test**: 检查生成文件路径、文件名格式、前言区键名与值类型是否满足规范；重复执行命令不会打乱结构。

**Acceptance Scenarios**:

1. Given 标题含特殊字符，When 运行命令，Then 文件名按 slug 规则转换，禁用非法字符。
2. Given 多次快速创建，When 重复运行，Then 文件名唯一且有序，不发生覆盖。

---

### Edge Cases

- 未传入标题或内容占位 → 使用默认占位并在前言区标注待填字段。
- 标题含空白或全符号 → 回退到日期加随机后缀命名。
- 目录不存在或权限不足 → 输出友好错误并提示如何修复。

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: 系统必须提供“新建博客模板”的命令，生成 Markdown 文件到博客目录，包含标准前言区与正文占位。
- **FR-002**: 系统必须提供“新建推特模板”的命令，生成 Markdown 文件到推特目录，包含标准前言区与内容占位。
- **FR-003**: 文件命名必须唯一、可读、可排序；当冲突时自动去重，禁止覆盖已有文件。
- **FR-004**: 前言区字段必须完整，键名稳定（如 title、description、date、tags、draft 等），类型可被现有内容系统识别。
- **FR-004.1（博客字段）**: 前言区对齐现有 blog 集合：author(默认 SITE.author)、pubDatetime(必填)、modDatetime(可选/可空)、title(必填)、featured(可选)、draft(可选)、tags(默认 ["others"])、ogImage(可选，或字符串/图片且需≥1200×630)、description(必填)、canonicalURL(可选)、minutesRead(可选)、wordCount(可选)。
- **FR-004.2（推特字段）**: 前言区对齐现有 tweets 集合：pubDatetime(必填字符串)、title(可选)、tags(默认 [])、draft(默认 false)、featured(默认 false)、sourceUrl(必填 URL)。
- **FR-005**: 目录路径、文件扩展名、日期格式必须一致且可配置（默认提供合理值）。
- **FR-006**: 失败时必须给出明确错误信息与修复建议。
- **FR-007**: 命令必须支持可选参数（如标题、描述、标签、日期、是否草稿），未提供时使用默认值。
- **FR-008**: 成功创建后必须输出新文件的绝对路径。

### Key Entities *(include if data involved)*

- **TemplateConfig**: 模板配置（目标目录、文件名规则、前言区字段默认值、占位内容）。
- **NewContentMeta**: 新建内容的元信息（标题、日期、标签、是否草稿）。

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: 用户在 10 秒内通过命令创建出新内容文件并可立即开始编写。
- **SC-002**: 100% 的生成文件通过现有站点构建校验，能被正常收录与渲染。
- **SC-003**: 同名冲突场景下，0 覆盖，100% 自动去重成功。
- **SC-004**: 80% 以上的创建动作无需额外参数（依赖合理默认值）即可完成。

## Assumptions

- 博客目录为 `src/content/blog/`，推特目录为 `src/content/tweets/`（如不同，可在命令配置中覆盖）。
- 日期默认采用 `YYYY-MM-DD` 或带时间的 `YYYY-MM-DD-HH-mm` 格式，用于文件名和前言区。
- Slug 规则与站点现有 `slugify` 一致，保证唯一性与可读性。

## Clarifications

### Session 2025-10-19

- Q: 前言区具体字段集合与默认值是否有增补需求？ → A: 与现有 schema 对齐（博客与推特使用当前内容集合定义的字段与默认值）。

## [NEEDS CLARIFICATION]

- 2) 推特是否允许多段内容/图片占位与外链列表？
- 3) 是否需要交互式命令（逐项提示）还是纯参数式？
