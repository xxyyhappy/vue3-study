/*
  vPermission.js —— 权限控制指令

  用法：<button v-permission="'admin'">删除</button>
  作用：用户没有指定权限时，隐藏元素
  场景：后台管理系统，不同角色看到不同按钮
*/

// 当前用户的权限列表（实际项目中从 Pinia store 获取）
const userPermissions = ["user", "admin"];

const vPermission = {
  // mounted：元素挂载时检查权限
  mounted: (el, binding) => {
    // binding.value：指令的值，比如 v-permission="'admin'" → value = "admin"
    const requiredPermission = binding.value;

    if (!userPermissions.includes(requiredPermission)) {
      // 没有权限 → 从 DOM 中移除元素
      el.parentNode?.removeChild(el);
    }
  },
  // updated：组件更新时重新检查（权限可能变化）
  updated: (el, binding) => {
    const requiredPermission = binding.value;

    if (!userPermissions.includes(requiredPermission)) {
      el.parentNode?.removeChild(el);
    } else {
      // 如果之前被移除，这里不做恢复（简化处理）
    }
  },
};

export default vPermission;
