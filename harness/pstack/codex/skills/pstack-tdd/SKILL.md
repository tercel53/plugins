---
name: pstack-tdd
description: 为 pstack 任务建立最窄的失败回归并验证修复，适用于用户要求 TDD 或已有廉价测试路径的缺陷。与 Matt 的 tdd 保持独立。
---

# pstack 回归验证

若入口经软链接安装，先用 realpath 或等价文件工具解析本 SKILL.md 的真实路径；本文所有相对引用均相对于真实文件目录，不相对于 .agents/skills 的链接位置。

读取 [Codex 适配约定](../../references/codex-adapter.md) 和 [原版 tdd](../../upstream/skills/tdd/SKILL.md)。保留原版失败先行和不强造昂贵测试的规则，命令使用当前宿主工具。

输入应包括预期行为、当前行为、实际入口、允许修改范围及测试命令。由 mode 调用时仅完成这个单元，不另起总流程；单独调用也不扩展到未授权文件或外部交付。

读取 [行为测试原则](../../upstream/skills/principle-test-behavior-not-implementation/SKILL.md)、[证据原则](../../upstream/skills/principle-prove-it-works/SKILL.md)。涉及调试再读取 fix-root-causes，阶段分解读取 sequence-verifiable-units，路径见依赖索引。

1. 优先使用已有框架和实际被测代码。确认测试从真实业务入口能覆盖目标行为，不复制实现规则来证明自己。
2. 使用确定的输入或受控请求顺序建立最小反例。失败必须来自目标断言；加载错误、认证错误、缺依赖不算行为红例。
3. 在获准范围实施最小修复，再运行原反例和相关契约检查。不要改断言迎合错误实现。
4. 新增回归还要核对生产源码变化能触发它。套件收录不等于增量选择正确。

保留用户现有改动。已修复的现场需要取得旧行为证据时使用隔离副本，不回退原工作区。测试无法合理实现时使用最近的可执行检查，说明覆盖缺口。

返回 PASS、FAIL、ALTERNATIVE 或 BLOCKED，附命令、失败原因、修复后结果、被测文件和未覆盖层级。ALTERNATIVE 不代表整项任务完成。原版先失败后通过不要求自动提交两个 commit。
