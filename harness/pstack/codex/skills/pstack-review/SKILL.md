---
name: pstack-review
description: 按 pstack 方法独立审查指定改动、验证证据和验收条件，输出分轴发现与处置建议；不自动改代码，不调用 Matt code-review。
---

# pstack 独立审查

若入口经软链接安装，先用 realpath 或等价文件工具解析本 SKILL.md 的真实路径；本文所有相对引用均相对于真实文件目录，不相对于 .agents/skills 的链接位置。

先读 [Codex 适配约定](../../references/codex-adapter.md) 和 [依赖索引中的审查规则](../../references/dependencies.md)。此入口只审查，修复责任返回调用者。

固定任务意图、比较基线、实际 diff 和需要的周边文件。不能写死 main，不能漏掉任务范围内未提交文件；把已有无关修改明确排除。

向至少一个实现者之外的 reviewer 传递相同输入包：目标、任务范围、项目规范、最终 diff、运行证据、缺口。调用者若已经是获委派的独立 reviewer，直接承担本次审查，不递归派生 reviewer。允许只读命令核实发现，不修改应用或测试文件。

读取上游 interrogate 的 [reviewer-prompt](../../upstream/skills/interrogate/references/reviewer-prompt.md)、[rubric](../../upstream/skills/interrogate/references/rubric.md)、[code-quality-review](../../upstream/skills/interrogate/references/code-quality-review.md) 和 [lead-judgment](../../upstream/skills/interrogate/references/lead-judgment.md)。模板中的宿主调用按适配约定处理。

- Standards 轴核对项目约束、契约、范围和可维护性。
- Spec 轴核对需求、真实入口、状态、错误路径及所需证据。UI 任务带项目规定的交互与截图输入；缺证据明确记录。
- 各轴分别列 Act on、Consider、Noted、Dismissed，附具体路径、证据、影响和理由。不混合两轴重排。
- 发现必须有可达路径或明确证据。风格偏好、抽象建议和猜测的极端输入不能冒充缺陷。
- no-comments 仅保留注释与约束检查视角。不能调用原版自动删注释流程，也不能因“拿不准”而删掉约束说明。

主会话核对每条有效发现；需设计或实现的发现交回 mode。修复后比较新 diff 并检查新证据，不能沿用旧 PASS。

输出审查者及模型信息、两轴发现、未验证项、PASS / CHANGES_REQUIRED / BLOCKED 判定。同模型独立角色可用，但不得声称原版多模型交叉验证已完成。无法获得独立角色时明确缺口。
