# Trae 自定义 Commands

Trae 的全局自定义命令通过「技能（Skills）」定义：在用户级技能目录下创建以命令名命名的文件夹，并在其中放入 `SKILL.md`，写明触发条件与执行步骤，即可在所有项目中使用。

## 一、目录结构

```text
~\.trae-cn\skills\
└── commit-info\
    └── SKILL.md
```

- **命令名**：即文件夹名，本例为 `commit-info`
- **全局生效**：目录位于用户主目录下，对该用户的所有项目生效
- **调用方式**：在对话中输入 `commit-info` 或 `commit info`

## 二、SKILL.md 的格式

### 1. YAML frontmatter

```markdown
---
name: commit-info
description: Summarize uncommitted git changes and suggest a Conventional Commits message in Chinese. Use when the user types commit-info or commit info, or asks for a commit message without committing. Do not use for actual commits, pushes, or code review.
---
```

- `name`：命令名，与所在文件夹名一致
- `description`：触发说明，需写清「何时使用」与「何时不使用」，智能体据此判断是否调用

### 2. 正文

正文是给智能体的执行说明，通常包含：硬性约束、执行步骤、输出格式和边界情况。

## 三、案例：commit-info

### 完整文件

```markdown
# Commit Info

只读操作。禁止执行 `git commit`、`git push`、`git add` 或任何会修改工作区、暂存区、索引的命令。

## 步骤

1. 执行 `git status --short`，确认是否存在未提交改动，覆盖已暂存、未暂存、未跟踪和已删除文件。
2. 执行 `git diff --stat`、`git diff`、`git diff --cached` 了解实际改动内容；改动类型不明确时，读取相关文件确认。
3. 需要贴合仓库风格时，执行 `git log -5 --oneline`，仅作参考，不照抄。
4. 输出：
   - 待提交文件清单（按已修改、未跟踪、已删除等状态分组）
   - 2–4 条中文改动摘要，说明「改了什么、为什么」
   - 一条建议的 commit message：`<type>(<scope>): <description>`。`type` 与可选 `scope` 用规范英文，`description` 用中文；破坏性变更加 `!`，必要时在正文补 `BREAKING CHANGE` 说明
5. 最后询问是否按该信息提交。用户未明确要求提交时，不得执行提交或推送。
6. 若没有未提交改动，直接说明，并给出 `git status` 的结论，不要编造提交内容。
```

### 可借鉴的写法

- **触发词前置**：`description` 明确列出 `commit-info`、`commit info` 等触发方式，并声明不适用的场景（实际提交、推送、代码审查）。
- **先写硬约束**：开头即声明只读，禁止 `git commit`、`git push`、`git add`，避免越权操作。
- **步骤具体可执行**：每一步都给出明确命令，并规定信息不足时读取文件确认。
- **固定输出结构**：文件清单、中文摘要、建议 commit message，便于直接使用。
- **覆盖边界情况**：无改动时直接说明，禁止编造内容。
