<template>
    <div class="w-full h-full flex justify-center">
        <div class="container">
            <a-space direction="vertical" fill>
                <a-card>
                    <div class="flex justify-between items-center">
                        <a-space>
                            <a-button>使用方法</a-button>
                            <a-button>一键脚本</a-button>
                        </a-space>
                        <a-button type="primary">查看配置</a-button>
                    </div>
                </a-card>
                <a-card>
                    <a-tabs default-active-key="1">
                        <a-tab-pane key="1" title="vless reality vision">
                            <VlessRealityVisionTab />
                        </a-tab-pane>
                        <a-tab-pane key="2" title="shadowsocks">
                            Content of Tab Panel 2
                        </a-tab-pane>
                        <a-tab-pane key="3" title="hysteria2">
                            Content of Tab Panel 3
                        </a-tab-pane>
                    </a-tabs>
                </a-card>
            </a-space>
        </div>
    </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import VlessRealityVisionTab from '../../components/vless-reality-vision.vue'

// 定义响应式数据
const data = ref(null);


// 生命周期钩子
onMounted(() => {
    console.log('组件已挂载')
})
</script>
