# CLAUDE.md

本文档为 Claude Code (claude.ai/code) 在本仓库中工作时提供指导。

## 常用命令

```bash
# 开发
npm run dev        # 启动 Vite 开发服务器（热更新）
npm run build      # 类型检查 + 生产构建
npm run preview    # 本地预览生产构建

# 代码检查与格式化
npm run lint        # ESLint 检查（含 --fix）
npm run format      # Prettier 格式化

# 测试
npm run test            # 运行所有 vitest 测试
npm run test:watch      # 监听模式运行测试
npm run test:coverage   # 运行测试并生成覆盖率报告
npm run test:ui         # 使用 vitest UI 运行测试
npm run typecheck       # 使用 vue-tsc 进行类型检查（不输出文件）

# 工具
npm run clean     # 删除 dist/ 和 node_modules
```

## 项目架构

这是一个使用 Vite 构建的 Vue 3 项目。

### 目录结构

```
src/
├── assets/           # 静态资源（图片、字体、全局样式）
├── components/       # 可复用的 Vue 组件（每个文件一个组件）
│   └── ui/           # 通用 UI 组件（Button、Modal 等）
├── composables/      # 共享的 Vue 组合式函数（useAuth、useFetch 等）
├── layouts/          # 页面布局组件（默认布局、登录布局、仪表盘布局等）
├── pages/            # 路由级别的页面组件（由路由自动导入）
├── router/           # Vue Router 配置和路由守卫
├── stores/           # Pinia 状态管理（每个 store 一个文件）
├── types/            # TypeScript 类型/接口定义
├── utils/            # 纯工具/辅助函数
├── mocks/            # MSW（Mock Service Worker）处理器和测试数据
├── App.vue           # 根组件
└── main.ts           # 应用入口文件
```

### 关键约定

- **组合式 API + `<script setup>`**：所有组件使用 `<script setup lang="ts">`，不使用选项式 API。
- **Pinia 状态管理**：全局状态放在 `src/stores/` 中，组件局部状态保留在组件内。
- **Vue Router 懒加载**：所有页面组件通过动态 `import()` 实现懒加载。
- **TypeScript**：启用严格模式。props 和 emits 优先使用显式接口而非类型推断。
- **CSS**：组件内使用 scoped 样式；全局变量和混入放在 `src/assets/styles/` 中。
- **组件命名**：多词 PascalCase 文件名（如 `UserProfile.vue`，不要用 `User.vue`）。
- **组合式函数**：命名为 `use*`（如 `useAuth.ts`），返回响应式 ref 而非普通值。

### 主要依赖

| 包名 | 用途 |
|---|---|
| `vue` ^3.5 | UI 框架 |
| `vue-router` ^4 | 客户端路由 |
| `pinia` ^2 | 状态管理 |
| `vite` ^6 | 构建工具和开发服务器 |
| `vitest` ^3 | 单元测试和组件测试 |
| `@vue/test-utils` ^2 | 组件测试辅助工具 |
| `eslint` ^9 + `prettier` ^3 | 代码检查和格式化 |
| `typescript` ^5.7 + `vue-tsc` ^2 | 类型检查 |
| `@playwright/test` ^2 | 端到端测试 |

### 测试约定

- 单元测试命名为 `*.test.ts`，与源码放在同一目录（如 `src/utils/format.test.ts`）。
- 组件测试命名为 `*.spec.ts`，放在组件旁边（如 `src/components/Button.spec.ts`）。
- 端到端测试放在 `e2e/` 目录下，使用 Playwright 运行。
- 组件测试推荐使用 `@vue/test-utils` + `vitest`，非必要不做浅渲染。

---

## 学习笔记规范

本仓库用于 Vue 3 零基础教学，所有笔记必须遵守以下规范。

### 笔记存储位置
所有笔记存放在项目根目录的 `./学习笔记/` 文件夹下。

### 文件命名格式
```
vue3笔记-第X阶段-名称.md
```
示例：
- `vue3笔记-第一阶段-环境搭建.md`
- `vue3笔记-第二阶段-模板语法.md`
- `vue3笔记-第三阶段-响应式数据.md`

### 笔记内容格式
1. **不用"第X课"**，直接使用知识点作为标题（如 `## ref —— 定义单个响应式数据`）
2. **每个阶段末尾**必须有"总结"章节，用表格汇总所学内容
3. 每个知识点包含：
   - 概念解释（大白话）
   - 完整可运行代码（每行均有中文注释）
   - 语法说明或对比表格
   - 重点/注意事项

### 教学代码规范
- 每行代码都要有中文注释
- 用大白话解释概念，不用黑话、不跳步
- 每节课结构：**概念解释 → 完整代码 → 逐行讲解 → 动手练习 → 小结**
- 课后自动将完整案例同步保存到 `./学习笔记/` 对应的笔记中

### 目标用户
零基础初学者，没接触过 Vue 或前端框架。所有教学材料需确保小白能独立看懂。
