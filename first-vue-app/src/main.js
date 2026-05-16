/* ============================================
   main.js —— 整个应用的入口

   现在加了路由，流程变成：
   1. 创建路由（router）
   2. 创建 Vue 应用（app）
   3. 把路由装进应用（app.use(router)）
   4. 挂载到页面
   ============================================ */

import { createApp } from 'vue'
import App from './App.vue'
import ElementPlus from 'element-plus'
import { createPinia } from 'pinia'

import 'element-plus/dist/index.css'

// 1. 引入路由配置
import router from './router/index.js'

// 2. 引入全局指令
import { registerDirectives } from './directives/index.js'

// 3. 创建 Vue 应用实例
const app = createApp(App)

// 3. 注册 Pinia（状态管理）
//    注意：Pinia 要在路由之前注册，这样路由守卫里才能用 Store
const pinia = createPinia()
app.use(pinia)

// 4. 注册路由
app.use(router)
app.use(ElementPlus)

// 5. 注册全局自定义指令
registerDirectives(app)

// 6. 挂载到页面
app.mount('#app')
