# 已启用依赖与 Codex 执行语义

路径均相对于本文件。以下 14 个上游工作技能提供方法；执行契约在本表和三个入口，不在上游工具调用段落。

| 方法 | 原文入口 | Codex 执行 |
| --- | --- | --- |
| poteto-mode | [原文](../upstream/skills/poteto-mode/SKILL.md) | 仅 Bug fix / Feature；由 pstack-mode 执行，交付替代 Opening a PR |
| how | [原文](../upstream/skills/how/SKILL.md) | 按相关 subsystem 分区只读调查；explorer-prompt / explainer-prompt 作为输入；主会话汇总真实调用链 |
| why | [原文](../upstream/skills/why/SKILL.md) | 用可访问历史和文档调查；读 epistemics、investigator-prompt、synthesizer-prompt；缺来源如实标记 |
| architect | [原文](../upstream/skills/architect/SKILL.md) | how 建立事实；所有权变化加 why；两个独立结构候选，读 runner-prompt / rationale-template，比较后实施 |
| arena | [原文](../upstream/skills/arena/SKILL.md) | 任务与评分条件明确后分派候选；独立输出；非候选作者评判；主会话选基底、吸收优点并验证 |
| swarm | [原文](../upstream/skills/swarm/SKILL.md) | 仅需要覆盖矩阵时分工调查；按宿主并发分批；记录缺失覆盖；不用它重复 arena |
| tdd | [原文](../upstream/skills/tdd/SKILL.md) | 调用本包 pstack-tdd；失败先行不意味着自动 commit |
| interrogate | [原文](../upstream/skills/interrogate/SKILL.md) | 调用本包 pstack-review；固定 diff，独立评审，按证据综合；同模型披露 |
| no-comments | [原文](../upstream/skills/no-comments/SKILL.md) | 只保留注释审查视角；弃用自动删除、拿不准就删与自动重构操作 |
| show-me-your-work | [原文](../upstream/skills/show-me-your-work/SKILL.md) | 长任务按 decision-log-template.tsv 记录；脱敏；独立角色读轨迹；不自动 commit |
| benchmark-checklist | [原文](../upstream/skills/benchmark-checklist/SKILL.md) | 实测性能前读取，命令按项目工具运行；不适用则不启动 benchmark |
| typescript-best-practices | [原文](../upstream/skills/typescript-best-practices/SKILL.md) | TS 类型任务读取 patterns.md；沿用当前项目技术版本 |
| technical-writing | [原文](../upstream/skills/technical-writing/SKILL.md) | 保留清晰表达方法，中文及项目格式优先 |
| unslop | [原文](../upstream/skills/unslop/SKILL.md) | 表达去空话；不替代项目格式，不自动修改来源技能 |

## 原则索引

所有路径为 ../upstream/skills/principle-<名称>/SKILL.md；用前先读叶子全文。名称保持上游英文标识。

- 写代码和结构：model-the-domain、foundational-thinking、boundary-discipline、type-system-discipline。
- 调试和反例：fix-root-causes、attack-the-premise。
- 验证与分解：prove-it-works、test-behavior-not-implementation、sequence-verifiable-units。
- 性能结论：explain-the-number，继续读取 benchmark-checklist。
- 控制复杂度：laziness-protocol、subtract-before-you-add、minimize-reader-load。
- 设计比较：redesign-from-first-principles、exhaust-the-design-space。
- 迁移：outcome-oriented-execution、migrate-callers-then-delete-legacy-apis。
- 并发与重试：make-operations-idempotent、separate-before-serializing-shared-state。
- 工具与固化：build-the-lever、encode-lessons-in-structure。
- 产品取舍：experience-first。
- 上下文：guard-the-context-window，委派受宿主条件约束。
- 自主推进：never-block-on-the-human，不覆盖用户授权或计划阶段限制。

## 入口组合

mode 调用上述按需方法、tdd、review。tdd 附加行为测试、根因、可验证单元和证据原则；原版 tdd 没有直接 Skill 依赖，这是本包组合规则。review 附加证据、读者负担、复杂度和根因原则；需要大调查或结构修复时返回 mode。

其余来源技能和剧本仅归档，不在首版自动启用。遇到必需而未映射的操作，记录缺口，不通过上游裸名称调用。编写技能时使用宿主 skill-creator；不依赖 Cursor 的 create-skill。
