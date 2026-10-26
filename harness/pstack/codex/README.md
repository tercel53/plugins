# pstack for Codex

这是基于 pstack 的 Codex 三入口适配版，保留原 Cursor / Claude Code 发布树。

- `pstack-mode`：小功能或缺陷的完整流程。
- `pstack-tdd`：行为回归、失败与修复证据。
- `pstack-review`：独立审查，发现交回主流程修复。

项目自定义入口和适配文档使用中文，上游资料保持英文及 MIT 许可证。默认显式调用，保留项目已有 Matt 工作流。同模型独立审查不等价于原版多模型审查。

## 准备和检查

在仓库根运行：

```sh
node scripts/build-pstack-codex.mjs
node scripts/build-pstack-codex.mjs --check
node --test scripts/pstack-codex.test.mjs
```

与 Claude Code harness 一样，生成器在启用的工作技能中注入 adapter 入口。原则文件保持原文；来源与生成结果分别记录摘要。

生成器固定上游资料摘要，`--check` 检查来源漂移。upstream 是只读方法库，不自动注册其 56 个原始技能。

## 项目安装

```sh
node scripts/install-pstack-codex.mjs /absolute/path/to/project
```

安装到项目 `docs/agents/pstack/codex`，仅在 `.agents/skills` 建立三个入口软链接。不覆盖同名文件，不修改 Matt、全局配置、Git 忽略规则或 Claude 链接。已存在目标时停止，更新前需明确处理已有安装。

从目标项目开启 Codex 会话，显式选择 `$pstack-mode`。若技能列表未刷新，重新开启会话。内部依赖按路径读取。没有独立子 Agent 能力时，独立审查会明确受阻。

支持范围、工具映射和项目边界见 references/。来源与文件摘要见 provenance.json，来源许可证位于 upstream/LICENSE。
