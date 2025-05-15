import { createApp } from 'vue'
import './style.css'
import App from './App.vue'
import ArcoVue from '@arco-design/web-vue';
import '@arco-design/web-vue/dist/arco.css';
import router from './router' // 新增

createApp(App).use(ArcoVue).use(router).mount('#app') // 新增 use(router)
