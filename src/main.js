import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import ArcoVue from '@arco-design/web-vue';
import ArcoVueIcon from '@arco-design/web-vue/es/icon';
import '@arco-design/web-vue/dist/arco.css';
import './style.css'

// 引入 Prism.js 核心
import 'prismjs';
// 引入主题样式（例如 prism-coy 或 prism-dark）
import 'prismjs/themes/prism-coy.css'; // 推荐使用 coy 主题，背景色和对比度较好
// 引入 JSON 语言支持
import 'prismjs/components/prism-json.js';


createApp(App).use(ArcoVue).use(ArcoVueIcon).use(router).mount('#app')
