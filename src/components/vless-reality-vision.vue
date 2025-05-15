<template>
    <a-form :model="model" layout="vertical">
        <a-form-item label="VLESS 端口" required>
            <a-input v-model="model.port" placeholder="请输入端口">
                <template #suffix>
                    <a-button type="text" size="mini" @click="model.port = randomPort()">随机端口</a-button>
                </template>
            </a-input>
        </a-form-item>
        <a-form-item label="VLESS 节点备注">
            <a-input v-model="model.remark" placeholder="用于订阅链接" />
        </a-form-item>
        <a-form-item label="服务器名称 (SNI)" required>
            <a-input v-model="model.sni" placeholder="如：www.itunes.com,itunes.com" />
        </a-form-item>
        <a-form-item label="目标地址 (dest)" required>
            <a-input v-model="model.dest" placeholder="如：itunes.com:443" />
        </a-form-item>
        <a-form-item label="Reality 指纹 (fp)">
            <a-select v-model="model.fp" placeholder="请选择指纹">
                <a-option value="chrome">Chrome (默认)</a-option>
                <a-option value="firefox">Firefox</a-option>
                <a-option value="safari">Safari</a-option>
                <a-option value="edge">Edge</a-option>
                <a-option value="ios">iOS</a-option>
                <a-option value="android">Android</a-option>
                <a-option value="randomized">Randomized</a-option>
            </a-select>
        </a-form-item>
        <a-form-item label="Reality Public Key (只读)">
            <a-input v-model="model.public_key" readonly />
        </a-form-item>
        <a-form-item label="Reality Short IDs (只读)">
            <div>
                <a-tag v-for="id in model.short_id" :key="id" color="arcoblue">{{ id }}</a-tag>
            </div>
        </a-form-item>
        <a-form-item label="VLESS 用户 UUID" required>
            <a-input v-model="model.uuid" placeholder="请输入UUID">
                <template #suffix>
                    <a-button type="text" size="mini" @click="model.uuid = randomUUID()">生成UUID</a-button>
                </template>
            </a-input>
        </a-form-item>
    </a-form>
</template>

<script setup lang="ts">
import { defineProps, ref } from 'vue'
// 生成随机端口
function randomPort() {
    return Math.floor(Math.random() * (65535 - 10000 + 1)) + 10000
}
// 生成UUID
function randomUUID() {
    // 简单 uuid 生成
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
        const r = Math.random() * 16 | 0, v = c === 'x' ? r : (r & 0x3 | 0x8)
        return v.toString(16)
    })
}
// reality vision 数据对象
const model = ref({
    port: randomPort(),
    uuid: randomUUID(),
    short_id: [],
    sni: 'www.itunes.com',
    dest: 'itunes.com:443',
    private_key: '',
    public_key: '',
    remark: 'vless-reality-in',
    fp: 'chrome',
});
</script>