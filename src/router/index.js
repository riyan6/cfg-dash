import { createRouter, createWebHistory } from 'vue-router'

// 示例页面组件（你可以根据需要新建这些文件）
import SingBox from '../views/sing-box/index.vue'

const routes = [
  {
    path: '/',
    name: 'Home',
    component: SingBox,
  },
  {
    path: '/sing-box',
    name: 'SingBox',
    component: SingBox,
  },
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

export default router