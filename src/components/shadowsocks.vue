<template>
  <a-form :model="model" layout="vertical">
    <a-form-item label="端口" required>
      <a-input v-model="model.port" placeholder="请输入端口">
        <template #suffix>
          <a-button size="mini" @click="model.port = randomPort()"
            >随机端口</a-button
          >
        </template>
      </a-input>
    </a-form-item>
    <a-form-item label="节点备注">
      <a-input v-model="model.remark" placeholder="请输入节点备注" />
    </a-form-item>
    <a-form-item label="加密方式">
      <a-select v-model="model.method" placeholder="请选择加密方式" @change="model.password = randomPassword()">
        <a-option value="2022-blake3-aes-128-gcm"
          >2022-blake3-aes-128-gcm</a-option
        >
        <a-option value="2022-blake3-aes-256-gcm"
          >2022-blake3-aes-256-gcm</a-option
        >
        <a-option value="2022-blake3-chacha20-poly1305"
          >2022-blake3-chacha20-poly1305</a-option
        >
        <a-option value="none">none</a-option>
        <a-option value="aes-128-gcm">aes-128-gcm</a-option>
        <a-option value="aes-192-gcm">aes-192-gcm</a-option>
        <a-option value="aes-256-gcm">aes-256-gcm</a-option>
        <a-option value="chacha20-ietf-poly1305"
          >chacha20-ietf-poly1305</a-option
        >
        <a-option value="xchacha20-ietf-poly1305"
          >xchacha20-ietf-poly1305</a-option
        >
      </a-select>
    </a-form-item>
    <a-form-item label="password">
      <a-input
        v-model="model.password"
        placeholder="请输入UUID"
        readonly
      >
      <template #suffix>
          <a-button size="mini" @click="model.password = randomPassword()"
            >随机密码</a-button
          >
        </template>
      </a-input>
    </a-form-item>
  </a-form>
</template>

<script setup lang="js">
import { reactive, onMounted, defineProps, watch } from 'vue';

// 定义 props 和 emits
const props = defineProps({
    modelValue: {
        type: Object,
        required: true
    }
});
const emit = defineEmits(['update:modelValue']);

// 数据对象
const model = reactive({ ...props.modelValue });

onMounted(() => {
    model.port = randomPort();
    model.password = randomPassword();
})

// 生成随机端口
const randomPort = () => {
    return Math.floor(Math.random() * (65535 - 10000 + 1)) + 10000
}

// 随机密码
const randomPassword = () => {
    if (model.method === 'none') {
        return ''
    }
    // 如果是2022-blake3-aes-128-gcm
    if (model.method === '2022-blake3-aes-128-gcm') {
        return generateSS2022Password(16)
    }
    // 如果是2022-blake3-aes-256-gcm
    if (model.method === '2022-blake3-aes-256-gcm') {
        return generateSS2022Password(32)
    }
    // 如果是2022-blake3-chacha20-poly1305
    if (model.method === '2022-blake3-chacha20-poly1305') {
        return generateSS2022Password(32)
    }
    return randomUUID()
}

const generateSS2022Password = (length = 32) => {
  const rawKey = new Uint8Array(length)
  crypto.getRandomValues(rawKey)

  // 标准 Base64 编码，不做 URL 安全化，不去掉 "="
  return btoa(String.fromCharCode(...rawKey))
}

// 生成UUID
const randomUUID = () => {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
        const r = Math.random() * 16 | 0, v = c === 'x' ? r : (r & 0x3 | 0x8)
        return v.toString(16)
    })
}


// 监听 model 的变化，emit 给父组件（深度监听）
watch(model, (newVal) => {
    emit('update:modelValue', { ...newVal })
}, { deep: true })

// 监听 modelValue 变化（如 tab 切换时），更新本地 model
watch(() => props.modelValue, (newVal) => {
    Object.assign(model, newVal)
}, { deep: true })
</script>
