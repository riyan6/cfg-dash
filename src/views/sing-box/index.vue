<template>
  <div class="w-full h-full flex justify-center">
    <div class="container">
      <a-space direction="vertical" fill>
        <a-card>
          <div class="flex justify-between items-center">
            <a-space>
              <a-button>使用方法</a-button>
            </a-space>
            <a-button type="primary" @click="onViewCfg">查看配置</a-button>
          </div>
        </a-card>
        <a-card>
          <a-tabs default-active-key="1">
            <template #extra>
              <a-space>
                <a-button type="text" @click="ruleSetDrawerVisible = true">规则集</a-button>
                <a-button type="text" @click="outboundDrawerVisible = true">出站规则</a-button>
                <a-button type="text">路由规则</a-button>
              </a-space>
            </template>
            <a-tab-pane key="1" title="vless reality vision">
              <VlessRealityVisionTab ref="realityFormRef" />
            </a-tab-pane>
            <a-tab-pane key="2" title="shadowsocks">
              Not supported now
            </a-tab-pane>
            <a-tab-pane key="3" title="hysteria2">
              Not supported now
            </a-tab-pane>
          </a-tabs>
        </a-card>
      </a-space>
    </div>
  </div>

  <!-- 配置弹窗 -->
  <a-drawer width="61.8%" :visible="drawerVisible" @ok="drawerVisible = false" @cancel="drawerVisible = false"
    unmountOnClose>
    <template #title> config.json 配置 </template>
    <div>
      <pre class="mockup-code line-numbers">
      <code :class="`language-json`">{{ singBoxCfg }}</code>
    </pre>
    </div>
  </a-drawer>

  <!-- 规则集 -->
  <a-drawer width="40%" :visible="ruleSetDrawerVisible" @ok="ruleSetDrawerVisible = false"
    @cancel="ruleSetDrawerVisible = false" unmountOnClose>
    <template #title>规则集配置</template>
    <div>
      <a-space>
        <a-button @click="ruleSetAddDrawerVisible = true">新增规则集</a-button>
      </a-space>
      <a-list class="mt-4">
        <a-list-item v-for="(item, index) in singBoxCfgTemplate.route.rule_set" :key="index">
          <a-list-item-meta :title="item.tag" :description="item.url">
          </a-list-item-meta>
          <template #actions>
            <icon-delete />
          </template>
        </a-list-item>
      </a-list>
    </div>
  </a-drawer>
  <!-- 新增规则集 -->
  <a-drawer width="30%" :visible="ruleSetAddDrawerVisible" @ok="onAddRuleSet" @cancel="ruleSetAddDrawerVisible = false"
    unmountOnClose>
    <template #title>新增规则集</template>
    <div>
      <a-form :model="ruleSetModel" :style="{ width: '100%' }">
        <a-form-item field="tag" label="标签">
          <a-input v-model="ruleSetModel.tag" placeholder="please enter tag..." />
        </a-form-item>
        <a-form-item field="url" label="远程地址">
          <a-input v-model="ruleSetModel.url" placeholder="please enter url..." />
        </a-form-item>
      </a-form>
    </div>
  </a-drawer>

  <!-- 出站规则 -->
  <a-drawer width="40%" :visible="outboundDrawerVisible" @ok="outboundDrawerVisible = false"
    @cancel="outboundDrawerVisible = false" unmountOnClose>
    <template #title>出站规则</template>
    <div>
      <a-space>
        <a-button @click="outboundModalVisible = true">新增出站规则</a-button>
      </a-space>
      <a-list class="mt-4">
        <a-list-item v-for="(item, index) in singBoxCfgTemplate.outbounds" :key="index">
          <a-list-item-meta :title="item.tag" :description="item.type">
          </a-list-item-meta>
          <template #actions>
            <a-button shape="circle">
              <icon-edit />
            </a-button>
            <a-button shape="circle">
              <icon-delete />
            </a-button>
          </template>
        </a-list-item>
      </a-list>
    </div>
  </a-drawer>
  <a-modal v-model:visible="outboundModalVisible" @ok="onOutboundConfirm" @cancel="outboundModalVisible = false">
    <template #title>
      新增出站规则
    </template>
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
      <a-form-item field="method" label="方法" v-if="outboundModel.type === 'shadowsocks'">
        <a-select v-model="outboundModel.method">
          <a-option value="2022-blake3-aes-128-gcm">2022-blake3-aes-128-gcm</a-option>
          <a-option value="2022-blake3-aes-256-gcm">2022-blake3-aes-256-gcm</a-option>
          <a-option value="2022-blake3-chacha20-poly1305">2022-blake3-chacha20-poly1305</a-option>
          <a-option value="none">none</a-option>
          <a-option value="aes-128-gcm">aes-128-gcm</a-option>
          <a-option value="aes-192-gcm">aes-192-gcm</a-option>
          <a-option value="aes-256-gcm">aes-256-gcm</a-option>
          <a-option value="chacha20-ietf-poly1305">chacha20-ietf-poly1305</a-option>
          <a-option value="xchacha20-ietf-poly1305">xchacha20-ietf-poly1305</a-option>
        </a-select>
      </a-form-item>
      <a-form-item field="username" label="用户名" v-if="outboundModel.type === 'socks'">
        <a-input v-model="outboundModel.username" />
      </a-form-item>
      <a-form-item field="password" label="密码"
        v-if="outboundModel.type === 'shadowsocks' || outboundModel.type === 'socks'">
        <a-input v-model="outboundModel.password" />
      </a-form-item>
      <a-form-item field="server" label="服务地址"
        v-if="outboundModel.type === 'shadowsocks' || outboundModel.type === 'socks'">
        <a-input v-model="outboundModel.server" />
      </a-form-item>
      <a-form-item field="server_port" label="端口"
        v-if="outboundModel.type === 'shadowsocks' || outboundModel.type === 'socks'">
        <a-input v-model="outboundModel.server_port" />
      </a-form-item>
      <a-form-item field="version" label="版本" v-if="outboundModel.type === 'socks'">
        <a-select v-model="outboundModel.version">
          <a-option value="5">5</a-option>
          <a-option value="4">4</a-option>
          <a-option value="4a">4a</a-option>
        </a-select>
      </a-form-item>

      <a-form-item field="domain_strategy" label="策略" v-if="outboundModel.type === 'direct'">
        <a-select v-model="outboundModel.domain_strategy">
          <a-option value="prefer_ipv4">prefer_ipv4</a-option>
          <a-option value="prefer_ipv6">prefer_ipv6</a-option>
          <a-option value="ipv4_only">ipv4_only</a-option>
          <a-option value="ipv6_only">ipv6_only</a-option>
        </a-select>
      </a-form-item>
    </a-form>
  </a-modal>


</template>

<script setup>
import { ref, onMounted, reactive } from "vue";
import VlessRealityVisionTab from "../../components/vless-reality-vision.vue";

// reality 表单
const realityFormRef = ref(null);

// 抽屉显示
const drawerVisible = ref(false);
// 规则集
const ruleSetDrawerVisible = ref(false);
// 规则集新增抽屉
const ruleSetAddDrawerVisible = ref(false);

// 出站规则
const outboundDrawerVisible = ref(false);
const outboundModalVisible = ref(false);
const outboundModel = reactive({
  type: 'direct',
  tag: '',
  server: '',
  server_port: '',
  username: '',
  password: '',
  method: '',
  version: '',
  domain_strategy: ''
})

// 规则集model
const ruleSetModel = reactive({
  tag: '',
  url: ''
})


// 配置
const singBoxCfg = ref("");
// 模板
const singBoxCfgTemplate = reactive({
  log: {
    level: 'info'
  },
  inbounds: [],
  outbounds: [
    { type: 'direct', tag: 'direct' },
    {
      "type": "direct",
      "tag": "direct-ipv4-prefer-out",
      "domain_strategy": "prefer_ipv4"
    },
    {
      "type": "direct",
      "tag": "direct-ipv4-only-out",
      "domain_strategy": "ipv4_only"
    },
    {
      "type": "direct",
      "tag": "direct-ipv6-prefer-out",
      "domain_strategy": "prefer_ipv6"
    },
    {
      "type": "direct",
      "tag": "direct-ipv6-only-out",
      "domain_strategy": "ipv6_only"
    },
    { type: 'block', tag: 'block' },
  ],
  route: {
    rule_set: [
      {
        tag: "geosite-cn",
        type: "remote",
        format: "binary",
        url: "https://raw.githubusercontent.com/MetaCubeX/meta-rules-dat/sing/geo/geosite/cn.srs",
        update_interval: "1d"
      },
      {
        tag: "geosite-category-ai-!cn",
        type: "remote",
        format: "binary",
        url: "https://raw.githubusercontent.com/MetaCubeX/meta-rules-dat/sing/geo/geosite/category-ai-!cn.srs",
        update_interval: "1d"
      },
      {
        tag: "geosite-bilibili",
        type: "remote",
        format: "binary",
        url: "https://raw.githubusercontent.com/MetaCubeX/meta-rules-dat/sing/geo/geosite/bilibili.srs",
        update_interval: "1d"
      },
    ],
    rules: [],
    final: "direct"
  },
  experimental: {
    cache_file: {
      enabled: true,
      path: "/etc/sing-box/cache.db",
      cache_id: "mycacheid",
      store_fakeip: true
    }
  }
});

// 生命周期钩子
onMounted(() => {
  console.log("组件已挂载");
});

const onViewCfg = () => {
  singBoxCfgTemplate.inbounds = [];

  // vless reality
  const realityFormData = realityFormRef.value?.getFormData();
  if (realityFormData) {
    singBoxCfgTemplate.inbounds.push({
      type: 'vless',
      tag: 'vless-in',
      listen: '::',
      listen_port: realityFormData.port,
      users: [
        { uuid: realityFormData.uuid, flow: 'xtls-rprx-vision' },
      ],
      tls: {
        enabled: true,
        server_name: realityFormData.sni,
        reality: {
          enabled: true,
          handshake: {
            server: realityFormData.sni,
            server_port: 443,
          },
          private_key: realityFormData.private_key,
          short_id: realityFormData.short_id,
        }
      },
    })
  }



  singBoxCfg.value = JSON.stringify(singBoxCfgTemplate, null, 2);
  drawerVisible.value = true;
};


// 新增规则集
const onAddRuleSet = () => {
  const item = {
    tag: ruleSetModel.tag,
    type: "remote",
    format: "binary",
    url: ruleSetModel.url,
    update_interval: "1d"
  }
  singBoxCfgTemplate.route.rule_set.push(item);
  ruleSetModel.url = '';
  ruleSetModel.tag = '';
  ruleSetAddDrawerVisible.value = false;
}

// 确认出站规则新增
const onOutboundConfirm = () => {
  if (outboundModel.type === 'shadowsocks') {
    singBoxCfgTemplate.outbounds.push({
      type: 'shadowsocks',
      tag: outboundModel.tag,
      method: outboundModel.method,
      password: outboundModel.password,
      server: outboundModel.server,
      server_port: outboundModel.server_port,
    })
    outboundModel.tag = '';
    outboundModel.method = '';
    outboundModel.password = '';
    outboundModel.server = '';
    outboundModel.server_port = '';
  }
  if (outboundModel.type === 'socks') {
    singBoxCfgTemplate.outbounds.push({
      type: 'socks',
      tag: outboundModel.tag,
      server: outboundModel.server,
      server_port: outboundModel.server_port,
      version: outboundModel.version,
      username: outboundModel.username,
      password: outboundModel.password,
    })
    outboundModel.tag = '';
    outboundModel.server = '';
    outboundModel.server_port = '';
    outboundModel.version = '';
    outboundModel.username = '';
    outboundModel.password = '';
  }

  outboundModalVisible.value = false;
}
</script>
