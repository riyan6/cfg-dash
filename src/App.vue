<script setup>
import { ref, watch } from 'vue'
import { useRouter, useRoute } from 'vue-router'

const router = useRouter()
const route = useRoute()

// key 与 path 的映射
const menuKeyMap = {
  '1': '/',
  '2': '/sing-box',
  '3': '/xray'
}
const pathKeyMap = Object.fromEntries(Object.entries(menuKeyMap).map(([k, v]) => [v, k]))

// 当前选中的菜单 key
const selectedKeys = ref([pathKeyMap[route.path] || '1'])

// 监听路由变化，更新菜单高亮
watch(
  () => route.path,
  (newPath) => {
    selectedKeys.value = [pathKeyMap[newPath] || '1']
  }
)

// 菜单点击事件
function onMenuClick(key) {
  const path = menuKeyMap[key]
  if (path && path !== route.path) {
    router.push(path)
  }
}
</script>

<template>
  <a-layout class="w-full h-full min-h-screen">
    <a-layout-header style="border-bottom: 1px solid #e5e6eb;">
      <a-menu
        mode="horizontal"
        :selected-keys="selectedKeys"
        @menu-item-click="onMenuClick"
      >
        <a-menu-item key="1">首页</a-menu-item>
        <a-menu-item key="2">SingBox</a-menu-item>
        <a-menu-item key="3">Xray</a-menu-item>
      </a-menu>
    </a-layout-header>
    <a-layout-content class="p-4">
      <router-view />
    </a-layout-content>
    <a-layout-footer class=" flex justify-center items-center p-8 bg-[#f2f3f5] text-[var(--color-neutral-6)]">
      Power by nuox.de
    </a-layout-footer>
  </a-layout>
</template>

<style scoped>
</style>
