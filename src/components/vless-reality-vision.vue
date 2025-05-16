<template>
    <a-form :model="model" layout="vertical">
        <a-form-item label="VLESS 端口" required>
            <a-input v-model="model.port" placeholder="请输入端口">
                <template #suffix>
                    <a-button size="mini" @click="model.port = randomPort()">随机端口</a-button>
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
        <a-form-item label="public key" required>
            <a-space direction="vertical" fill style="width: 100%">
                <a-input v-model="model.public_key" readonly placeholder="自动生成">
                    <template #prepend>
                        公钥
                    </template>
                </a-input>
                <a-input-password v-model="model.private_key" readonly placeholder="自动生成">
                    <template #prepend>
                        私钥
                    </template>
                </a-input-password>
                <template #extra>
                    <a-button size="mini">重新生成密钥对和ShortIDs</a-button>
                </template>
            </a-space>
        </a-form-item>
        <a-form-item label="short_id">
            <div v-if="model.short_id && model.short_id.length > 0" class="shortid-tags-container">
                <a-tag class="mr-1 mb-1" v-for="sid in model.short_id" :key="sid" color="blue">{{
                    sid
                }}
                </a-tag>
            </div>
            <span v-else>将自动生成</span>
        </a-form-item>
        <a-form-item label="uuid" required>
            <a-input v-model="model.uuid" placeholder="请输入UUID" readonly>
                <template #suffix>
                    <a-button size="mini" @click="model.uuid = randomUUID()">生成UUID</a-button>
                </template>
            </a-input>
        </a-form-item>
    </a-form>
</template>

<script setup lang="js">
import { ref, onMounted, defineExpose } from 'vue';
import * as nacl from 'tweetnacl';

onMounted(() => {
    regenerateVlessRealityData()
})

// 生成随机端口
function randomPort() {
    return (Math.floor(Math.random() * (65535 - 10000 + 1)) + 10000).toString()
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
    port: randomPort().toString(),
    uuid: randomUUID(),
    short_id: [],
    sni: 'www.itunes.com',
    dest: 'itunes.com:443',
    private_key: '',
    public_key: '',
    remark: 'vless-reality-in',
    fp: 'chrome',
});


const regenerateVlessRealityData = () => {
    const kp = generateEd25519KeyPair();
    model.value.private_key = kp.privateKey;
    model.value.public_key = kp.publicKey;
    model.value.short_id = kp.shortIds;
    // Message.success('VLESS Reality 密钥对和 ShortIDs 已重新生成');
};


const generateEd25519KeyPair = () => {
    // 生成 Reality 密钥对（X25519）
    const kp = nacl.box.keyPair();
    const privateKey = toBase64Url(kp.secretKey.slice(0, 32));
    const publicKey = toBase64Url(kp.publicKey);

    // 生成 Short IDs
    const generateRandomHex = (length) => {
        const bytes = new Uint8Array(length);
        crypto.getRandomValues(bytes);
        return Array.from(bytes)
            .map(b => b.toString(16).padStart(2, '0'))
            .join('');
    };

    const shortIds = [];
    const count = Math.floor(Math.random() * 4) + 2; // 2~5 个
    while (shortIds.length < count) {
        const len = Math.floor(Math.random() * 6) + 1; // 1~6 字节
        const hex = generateRandomHex(len);
        if (!shortIds.includes(hex)) {
            shortIds.push(hex);
        }
    }

    return {
        privateKey,
        publicKey,
        shortIds
    };
};

const toBase64Url = (buf) => {
    const binary = String.fromCharCode(...buf);
    return btoa(binary)
        .replace(/\+/g, '-')
        .replace(/\//g, '_')
        .replace(/=+$/, '');
};

const getFormData = () => {
    return model.value;
}

defineExpose({
    getFormData
})
</script>