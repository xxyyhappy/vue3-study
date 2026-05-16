// injectKeys.js —— 统一管理 Provide/Inject 的 Symbol key
// 用 Symbol 避免命名冲突（多个库用了相同的字符串 key）

export const THEME_KEY = Symbol("theme");
export const USER_KEY = Symbol("user");
