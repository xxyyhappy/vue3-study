/*
  router/index.js —— 路由规则

  作用：告诉 Vue —— "什么URL，显示什么组件"

  就像淘宝的快递分拣：
  - 包裹上写 "北京" → 扔到北京那堆
  - 包裹上写 "上海" → 扔到上海那堆

  这里也一样：
  - URL 是 /      → 显示 Home.vue
  - URL 是 /about → 显示 About.vue
*/

// 1. 从 vue-router 包里拿出两个工具
//    createRouter：创建路由的"机器"
//    createWebHistory：让 URL 用 /about 这种格式（而不是 #/about）
import { createRouter, createWebHistory } from "vue-router";

// 2. 引入页面组件
import Home from "../pages/Home.vue";
import About from "../pages/About.vue";
import User from "../pages/User.vue";
import Product from "../pages/Product.vue";
import Login from "../pages/Login.vue";
import RouteMode from "../pages/RouteMode.vue";
import Header from "../pages/Header.vue";
import Footer from "../pages/Footer.vue";

// 嵌套路由：引入布局组件和子页面
import UserLayout from "../layouts/UserLayout.vue";
import UserHome from "../pages/UserHome.vue";
import UserProfile from "../pages/UserProfile.vue";
import UserSettings from "../pages/UserSettings.vue";
import UserOrders from "../pages/UserOrders.vue";
import NotFound from "../pages/NotFound.vue";
import Dashboard from "../pages/Dashboard.vue";
import GuardDemo from "../pages/GuardDemo.vue";
import PiniaDemo from "../pages/PiniaDemo.vue";
import AdvComponentsDemo from "../pages/AdvComponentsDemo.vue";

// 各阶段演示页
import TemplateSyntaxDemo from "../pages/TemplateSyntaxDemo.vue";
import ReactiveDataDemo from "../pages/ReactiveDataDemo.vue";
import ComponentBasicsDemo from "../pages/ComponentBasicsDemo.vue";
import ComposablesDemo from "../pages/ComposablesDemo.vue";
import ProvideInjectDemo from "../pages/ProvideInjectDemo.vue";
import CustomDirectivesDemo from "../pages/CustomDirectivesDemo.vue";

// Pinia Store —— 在路由守卫中也能直接使用
import { useAuthStore } from "../stores/auth.js";

// 3. 定义路由规则（核心！）
const routes = [
  {
    path: "/",
    name: "home",
    components: {
      default: Home,
      Header: Header,
      Footer: Footer,
    },
  },
  {
    path: "/about",
    name: "about",
    component: About,
    meta: {
      title: "关于我们",
      requiresAuth: true,
    },
  },
  {
    // 动态路由：单个 :id 参数
    path: "/user/:id",
    name: "user",
    component: User,
    meta: {
      title: "用户详情",
      requiresAuth: false,
      roles: ["admin"],
    },
    beforeEnter: (to, from) => {
      const authStore = useAuthStore();

      console.log("路由守卫：", {
        from: from.fullPath,
        to: to.fullPath,
        requiresAuth: to.meta.requiresAuth,
        isLoggedIn: authStore.isLoggedIn,
      });

      // 如果目标页面需要登录，但用户没登录 → 拦截！
      if (to.meta.requiresAuth && !authStore.isLoggedIn) {
        console.log("未登录，重定向到登录页");
        return { name: "login", query: { redirect: to.fullPath } };
      }

      // 角色权限检查
      if (to.meta.roles && !authStore.user?.roles?.includes(to.meta.roles[0])) {
        console.log("无权限，重定向到登录页");
        return { name: "login", query: { redirect: to.fullPath } };
      }

      return true;
    },
  },
  {
    // 商品动态路由
    path: "/product/:id",
    name: "product",
    component: Product,
  },
  {
    // 登录页（编程式导航演示）
    path: "/login",
    name: "login",
    component: Login,
  },
  {
    // 路由模式演示
    path: "/route-mode",
    name: "route-mode",
    component: RouteMode,
  },

  {
    // 受保护页面：需要登录才能访问
    path: "/dashboard",
    name: "dashboard",
    component: Dashboard,
    meta: { requiresAuth: true }, // 标记：这条路由需要登录
  },
  {
    // 路由守卫演示页
    path: "/guard-demo",
    name: "guard-demo",
    component: GuardDemo,
  },
  {
    // Pinia 状态管理演示页
    path: "/pinia-demo",
    name: "pinia-demo",
    component: PiniaDemo,
    meta: { title: "Pinia 状态管理" },
  },
  {
    // 组件进阶演示页（Slot、动态组件、KeepAlive、Teleport、Suspense）
    path: "/adv-components",
    name: "adv-components",
    component: AdvComponentsDemo,
    meta: { title: "组件进阶" },
  },

  // ===== 各阶段演示页 =====
  {
    path: "/template-syntax",
    name: "template-syntax",
    component: TemplateSyntaxDemo,
    meta: { title: "模板语法" },
  },
  {
    path: "/reactive-data",
    name: "reactive-data",
    component: ReactiveDataDemo,
    meta: { title: "响应式数据" },
  },
  {
    path: "/component-basics",
    name: "component-basics",
    component: ComponentBasicsDemo,
    meta: { title: "组件化开发" },
  },
  {
    path: "/composables",
    name: "composables",
    component: ComposablesDemo,
    meta: { title: "组合式函数" },
  },
  {
    path: "/provide-inject",
    name: "provide-inject",
    component: ProvideInjectDemo,
    meta: { title: "Provide / Inject" },
  },
  {
    // 自定义指令演示页
    path: "/custom-directives",
    name: "custom-directives",
    component: CustomDirectivesDemo,
    meta: { title: "自定义指令" },
  },

  // ===== 嵌套路由（重点！） =====
  // 父路由：/user-center，显示 UserLayout.vue 布局
  // 子路由：/user-center/profile、/user-center/settings 等
  // 布局不变（左侧菜单），只有右侧内容区变化
  {
    path: "/user-center",
    name: "user-center",
    component: UserLayout, // 父组件（布局）
    children: [
      // 子路由写法：path 不加 / 前缀
      // "profile" 的完整路径是 /user-center/profile
      {
        path: "profile",
        name: "user-profile",
        component: UserProfile,
      },
      {
        path: "settings",
        name: "user-settings",
        component: UserSettings,
        meta: { requiresAuth: true },
      },
      {
        path: "orders",
        name: "user-orders",
        component: UserOrders,
        meta: { requiresAuth: true },
      },
      // 空字符串 path = 默认子路由
      // 访问 /user-center 时自动显示 UserHome
      {
        path: "",
        name: "user-home",
        component: UserHome,
      },
    ],
  },
  // 404 必须放最后（路由匹配是从上往下，前面的都没匹配到才走到这）
  {
    path: "/:pathMatch(.*)*", // 正则：匹配所有字符
    name: "not-found",
    component: NotFound,
  },
];

// 4. 用上面定义的规则，创建路由实例
const router = createRouter({
  history: createWebHistory(),
  routes,
});

// ===== 路由守卫 =====

// 4.1 全局前置守卫：每次跳转前执行
// 就像商场的"门口保安"——每个顾客进来前都要检查
router.beforeEach((to, from) => {
  // to：要去哪（目标路由）
  // from：从哪来（当前路由）
  // 注意：Vue Router 4 不再用 next()，直接 return true/false 或重定向路径

  // 获取 auth store（Pinia 实例）
  const authStore = useAuthStore();

  // 路由 meta 详情（方便观察）
  console.log("🛡️ [beforeEach] 守卫触发：", {
    from: from.fullPath,
    to: to.fullPath,
    requiresAuth: to.meta.requiresAuth,
    isLoggedIn: authStore.isLoggedIn,
  });

  // 如果目标页面需要登录，但用户没登录 → 拦截！
  if (to.meta.requiresAuth && !authStore.isLoggedIn) {
    console.log("🛡️ → 未登录，重定向到登录页");
    // 重定向到登录页，并把目标地址记在 query 上
    // 登录成功后可以通过 redirect 参数跳回来
    return { name: "login", query: { redirect: to.fullPath } };
  }

  // 默认放行（什么也不返回 = 放行）
  console.log("🛡️ → 放行！");
});

// 4.2 全局后置钩子：跳转完成后执行
// 不能拦截，只能做些"事后"操作（改页面标题、记录日志等）
router.afterEach((to, from) => {
  // 设置页面标题
  document.title = to.meta?.title
    ? `${to.meta.title} - Vue 学习2`
    : "Vue 学习1";

  const authStore = useAuthStore();

  console.log("📋 [afterEach] 跳转完成：", {
    from: from.fullPath,
    to: to.fullPath,
    title: document.title,
  });
  if (authStore.isLoggedIn) {
    document.title = "登录";
    console.log("用户已登录");
  } else {
    document.title = "未登录";
    console.log("用户未登录");
  }

  window.scrollTo(0, 0);
  // 告诉统计工具，用户访问了哪个页面
  if (typeof _hmt !== "undefined") {
    _hmt.push(["_trackPageview", to.fullPath]);
  }
});

// 5. 把路由实例导出，给 main.js 用
export default router;
