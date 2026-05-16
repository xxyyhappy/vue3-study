import { defineStore } from "pinia";

export const useDataStore = defineStore("globalData", {
  state: () => ({
    // 这里可以放 N 个需要共享的数据
    msgFromGrandson: "",
    count: 0,
    userInfo: null,
    todoList: [],
    stores: {},
  }),

  actions: {
    /**
     * 【通用方法】更新任意 state 数据
     * @param {string} key  state 中的字段名，如 'msgFromGrandson'
     * @param {any} value  要设置的值
     */
    updateState(key, value) {
      // 校验字段是否存在，避免写错名字
      if (Object.prototype.hasOwnProperty.call(this.$state, key)) {
        this[key] = value;
      } else {
        console.warn(`Pinia 中不存在字段：${key}`);
      }
    },
  },
});
