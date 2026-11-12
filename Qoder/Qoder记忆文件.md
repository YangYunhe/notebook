# Qoder 记忆文件

## 1. 用户级规则目录

- 目录：`~\.trae-cn\rules\`（`C:\Users\yangyunhe\.trae-cn\rules\`）
- 作用：用户级（全局）规则目录，对该用户下的所有项目生效。
- 书写方式：每个规则为独立的 `.md` 文件，以 YAML frontmatter 声明 `trigger`，正文使用 Markdown。

```markdown
---
trigger: always_on
---
# 规则标题

规则正文……
```
