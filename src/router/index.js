import { createRouter, createWebHistory } from 'vue-router'

// 示例页面组件（你可以根据需要新建这些文件）
import Home from '../components/HelloWorld.vue'

const routes = [
  {
    path: '/',
    name: 'Home',
    component: Home,
    props: { msg: '首页' }
  },
  {
    path: '/sing-box',
    name: 'SingBox',
    component: () => import('../views/sing-box/index.vue'),
    props: { msg: 'SingBox' }
  },
  // 你可以继续添加更多路由
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

export default router