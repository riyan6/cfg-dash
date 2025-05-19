<script setup>
import { ref, watch, onMounted } from "vue";
import { useRouter, useRoute } from "vue-router";

const router = useRouter();
const route = useRoute();

// key 与 path 的映射
const menuKeyMap = {
  1: "/",
  2: "/outbound",
  3: "/router",
};
const pathKeyMap = Object.fromEntries(
  Object.entries(menuKeyMap).map(([k, v]) => [v, k])
);

// 当前选中的菜单 key
const selectedKeys = ref([pathKeyMap[route.path] || "1"]);

// 监听路由变化，更新菜单高亮
watch(
  () => route.path,
  (newPath) => {
    selectedKeys.value = [pathKeyMap[newPath] || "1"];
  }
);

// 菜单点击事件
const onMenuClick = (key) => {
  const path = menuKeyMap[key];
  if (path && path !== route.path) {
    router.push(path);
  }
};

// 主题相关
const theme = ref(localStorage.getItem("theme") || "auto");

// 设置主题
const setTheme = (newTheme) => {
  theme.value = newTheme;
  localStorage.setItem("theme", newTheme);
  applyTheme(newTheme);
};

// 应用主题
const applyTheme = (currentTheme) => {
  if (currentTheme === "auto") {
    // 跟随系统
    if (
      window.matchMedia &&
      window.matchMedia("(prefers-color-scheme: dark)").matches
    ) {
      document.body.setAttribute("arco-theme", "dark");
    } else {
      document.body.removeAttribute("arco-theme");
    }
  } else if (currentTheme === "dark") {
    document.body.setAttribute("arco-theme", "dark");
  } else {
    document.body.removeAttribute("arco-theme");
  }
};

// 监听系统主题变化
onMounted(() => {
  applyTheme(theme.value);

  // 监听系统主题变化
  if (window.matchMedia) {
    const colorSchemeQuery = window.matchMedia("(prefers-color-scheme: dark)");
    colorSchemeQuery.addEventListener("change", (e) => {
      if (theme.value === "auto") {
        applyTheme("auto");
      }
    });
  }
});
</script>

<template>
  <a-layout class="w-full h-full min-h-screen">
    <a-layout-header>
      <div class="flex justify-between items-center">
        <a-menu
          mode="horizontal"
          :selected-keys="selectedKeys"
          @menu-item-click="onMenuClick"
        >
          <a-menu-item key="1">入站配置</a-menu-item>
          <a-menu-item key="2">出站配置</a-menu-item>
          <a-menu-item key="3">路由配置</a-menu-item>
        </a-menu>

        <!-- <a-dropdown @select="(v) => setTheme(v)">
          <a-button>主题</a-button>
          <template #content>
            <a-doption value="light">
              <template #icon>
                <icon-sun />
              </template>
              <template #default>浅色模式</template>
            </a-doption>
            <a-doption value="dark">
              <template #icon>
                <icon-moon />
              </template>
              <template #default>深色模式</template>
            </a-doption>
            <a-doption value="auto">
              <template #icon>
                <icon-computer />
              </template>
              <template #default>跟随系统</template>
            </a-doption>
          </template>
        </a-dropdown> -->
      </div>
    </a-layout-header>
    <a-layout-content class="p-4 bg-[var(--color-fill-2)]">
      <router-view />
    </a-layout-content>
    <a-layout-footer
      class="flex justify-center items-center flex-col gap-1 p-8 bg-[var(--color-bg-2)] text-[var(--color-text-3)]"
    >
      <p>Power by nuox.de © 2025</p>
      <p>当前支持版本 <a-tag>sing-box v1.11.x</a-tag></p>
    </a-layout-footer>
  </a-layout>
</template>

<style scoped></style>
