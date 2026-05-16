/*
  directives/index.js —— 全局指令注册入口

  用法：在 main.js 中 import 后统一注册
*/

import vFocus from "./vFocus.js";
import vPermission from "./vPermission.js";
import vDebounce from "./vDebounce.js";
import vCopy from "./vCopy.js";
import vLongpress from "./vLongpress.js";
import vWaterMark from "./vWaterMark.js";

// 防抖默认延迟（毫秒）
export const directiveDebounceMs = 300;

// 所有指令列表
const directives = [
  { name: "focus", directive: vFocus },
  { name: "permission", directive: vPermission },
  { name: "debounce", directive: vDebounce },
  { name: "copy", directive: vCopy },
  { name: "longpress", directive: vLongpress },
  { name: "waterMark", directive: vWaterMark },
];

// 注册函数：接收 app 实例，遍历注册所有指令
export function registerDirectives(app) {
  directives.forEach(({ name, directive }) => {
    app.directive(name, directive);
  });
}

export default directives;
