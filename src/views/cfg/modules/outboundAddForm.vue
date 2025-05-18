<template>
    <a-form :model="outboundModel">
      <a-form-item field="tag" label="标签">
        <a-input v-model="outboundModel.tag" />
      </a-form-item>
      <a-form-item field="type" label="类型">
        <a-select v-model="outboundModel.type">
          <a-option value="direct">direct</a-option>
          <a-option value="shadowsocks">shadowsocks</a-option>
          <a-option value="socks">socks</a-option>
        </a-select>
      </a-form-item>
      <a-form-item
        field="method"
        label="方法"
        v-if="outboundModel.type === 'shadowsocks'"
      >
        <a-select v-model="outboundModel.method">
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
      <a-form-item
        field="username"
        label="用户名"
        v-if="outboundModel.type === 'socks'"
      >
        <a-input v-model="outboundModel.username" />
      </a-form-item>
      <a-form-item
        field="password"
        label="密码"
        v-if="
          outboundModel.type === 'shadowsocks' || outboundModel.type === 'socks'
        "
      >
        <a-input v-model="outboundModel.password" />
      </a-form-item>
      <a-form-item
        field="server"
        label="服务地址"
        v-if="
          outboundModel.type === 'shadowsocks' || outboundModel.type === 'socks'
        "
      >
        <a-input v-model="outboundModel.server" />
      </a-form-item>
      <a-form-item
        field="server_port"
        label="端口"
        v-if="
          outboundModel.type === 'shadowsocks' || outboundModel.type === 'socks'
        "
      >
        <a-input v-model="outboundModel.server_port" />
      </a-form-item>
      <a-form-item
        field="version"
        label="版本"
        v-if="outboundModel.type === 'socks'"
      >
        <a-select v-model="outboundModel.version">
          <a-option value="5">5</a-option>
          <a-option value="4">4</a-option>
          <a-option value="4a">4a</a-option>
        </a-select>
      </a-form-item>

      <a-form-item
        field="domain_strategy"
        label="策略"
        v-if="outboundModel.type === 'direct'"
      >
        <a-select v-model="outboundModel.domain_strategy">
          <a-option value="prefer_ipv4">prefer_ipv4</a-option>
          <a-option value="prefer_ipv6">prefer_ipv6</a-option>
          <a-option value="ipv4_only">ipv4_only</a-option>
          <a-option value="ipv6_only">ipv6_only</a-option>
        </a-select>
      </a-form-item>
    </a-form>
</template>

<script setup>
import { reactive } from "vue";

const outboundModel = reactive({
  type: "direct",
  tag: "",
  server: "",
  server_port: "",
  username: "",
  password: "",
  method: "",
  version: "",
  domain_strategy: "",
});

</script>