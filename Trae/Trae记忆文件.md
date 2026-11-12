# Trae 记忆文件

## 用户级规则目录

- 目录：`~\.trae-cn\rules`
- 作用：Trae 的用户级（全局）规则目录，对该用户下的所有项目生效。
- 书写方式：每个规则为独立的 `.md` 文件，文件头以 YAML frontmatter 声明 `trigger`，正文使用 Markdown。

## 用户级记忆文件

- 目录：`~\.trae-cn\memory\`
- 文件名：`user_profile.md`
- 作用：用户级记忆文件，对该用户下的所有项目生效。
- 书写方式：Markdown 文件。

## 项目级记忆文件

- 目录：`~\.trae-cn\memory\projects\<软件生成的项目目录>\`
- 文件名：`project_memory.md`
- 作用：项目级记忆文件，仅对对应项目生效。
- 书写方式：Markdown 文件。
- 目录说明：项目目录名由软件自动生成，其中包含项目名。例如项目实际名称为 `Huicelink`，对应目录为 `-d-Projects-Huicelink--p2-5f8ed3f704a6f3a3a07e`。

## 导入设置（兼容 Codex / Claude Code）

路径：`文件` → `首选项` → `设置` → `规则与记忆` → `导入设置`

- 将 `AGENTS.md` 包含在上下文中：默认开启，智能体读取根目录的 `AGENTS.md` 并加入上下文。
- 将 `CLAUDE.md` 包含在上下文中：默认关闭，智能体读取根目录的 `CLAUDE.md` 和 `CLAUDE.local.md` 并加入上下文。

说明：Trae 兼容 Codex 和 Claude Code 的用户级、项目级记忆文件。
