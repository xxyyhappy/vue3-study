/* ============================================
   vite.config.js —— Vite 构建工具的配置文件

   Vite 的作用：
   - 启动开发服务器（热更新）
   - 打包项目用于生产环境
   - 处理 .vue 文件等特殊格式

   这里我们告诉 Vite：请用 @vitejs/plugin-vue 插件
   来处理 .vue 文件
   ============================================ */

// 从 @vitejs/plugin-vue 中引入 Vue 插件
import vue from '@vitejs/plugin-vue'

// 使用 Vite 的 defineConfig 来定义配置
// （写配置时有更好的代码提示）
import { defineConfig } from 'vite'

// 导出配置
export default defineConfig({
  plugins: [
    vue()  // 告诉 Vite 要处理 .vue 文件
  ]
})
