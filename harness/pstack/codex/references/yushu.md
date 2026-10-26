# yushu 接入

先读目标检出的 AGENTS.md、对应 fe / be 指南和 LESSONS 活跃索引，再读命中条目。不要硬编码个人目录，不访问旧 yushu-h5 检出。

验证前读 docs/local-verification.md。使用 quality/verify.sh 的计划与执行入口，确认基线和源码变更选择；以实际文件和命令支持报告。仅修改测试文件会触发套件，不代表未来仅修改组件也触发回归。

UI 任务读 docs/agents/ui-review.md，分别记录 Standards 和 Spec。真实服务/API 验证时按项目要求读取 verify-yushu-dam；场景覆盖需要时读取 ui-e2e-coverage。缺必需 Skill 明确报告，不编造工具。

## 数据库同步预览的验证范围

使用实际组件 fe/yushu-dis-h5/src/views/dataSynchronization/pages/databaseSync.vue 和 quality/database-sync-preview.test.ts。当前测试形状和未提交改动要重新检查，不能把过去会话结论当当前事实。

验收目标由任务明确：映射接口提供目标库表；ALL / MULTI 选择正确；切换、清空、删除和错误状态符合约定。测试实际事件入口，避免只验证被抽出的内部函数。

局部确定性回归可在隔离副本执行，不能回退用户工作区。真实 UI 从 Kael 主应用入口进入。已有整库同步 E2E 可能会写入业务夹具，读取契约并核对授权，不因已存在脚本或 ALLOW_WRITE 环境变量就擅自执行。

真实 UI、API、整库同步及远端门禁分别报告。隔离样例通过证明局部行为或流程适配，不等于 yushu 全业务验收完成。
