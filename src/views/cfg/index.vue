<template>
  <div class="w-full h-full flex justify-center">
    <div class="container">
      <a-space direction="vertical" fill>
        <a-card>
          <div class="flex justify-between items-center">
            <a-space>
              <a-button type="outline" @click="usageDrawerVisible = true">使用方法</a-button>
            </a-space>
            <a-button type="primary" @click="onHandlerViewConfig">查看配置</a-button>
          </div>
        </a-card>
        <a-card>
          <a-tabs default-active-key="1" :editable="false" auto-switch>
            <template #extra>
              <a-dropdown v-if="false" @select="handleSelectProtocol">
                <a-button>新增</a-button>
                <template #content>
                  <a-doption>shadowsocks</a-doption>
                  <a-doption>hysteria2</a-doption>
                </template>
              </a-dropdown>
            </template>
            <a-tab-pane
              :key="tab.key"
              :title="tab.title"
              v-for="(tab, index) in tabsData"
            >
              <component :is="tab.component" :key="index" v-model="tab.data" />
            </a-tab-pane>
          </a-tabs>
        </a-card>
      </a-space>
    </div>
  </div>

  <!-- 配置弹窗 -->
  <a-drawer
    :width="configDrawerWidth"
    :visible="configDrawerVisible"
    @ok="configDrawerVisible = false"
    @cancel="configDrawerVisible = false"
    unmountOnClose
  >
    <template #title> config.json 配置 </template>
    <div>
      <a-tabs default-active-key="1">
        <a-tab-pane key="1" title="sing-box">
          <div class="flex justify-end mb-2">
          <a-button type="primary" size="small" @click="copyConfig('singbox')">
            <template #icon>
              <icon-copy />
            </template>
            复制配置
          </a-button>
        </div>
          <pre class="mockup-code line-numbers">
      <code :class="`language-json`">{{ singBoxConfigStr }}</code>
    </pre>
        </a-tab-pane>
        <a-tab-pane key="2" title="xray">
          <div class="flex justify-end mb-2">
          <a-button type="primary" size="small" @click="copyConfig('xray')">
            <template #icon>
              <icon-copy />
            </template>
            复制配置
          </a-button>
        </div>
          <pre class="mockup-code line-numbers">
      <code :class="`language-json`">{{ xrayConfigStr }}</code>
    </pre>
        </a-tab-pane>
      </a-tabs>
    </div>
  </a-drawer>

  <!-- 使用方法弹窗 -->
  <a-drawer
    :width="usageDrawerWidth"
    placement="left"
    :visible="usageDrawerVisible"
    @ok="usageDrawerVisible = false"
    @cancel="usageDrawerVisible = false"
    unmountOnClose
  >
    <template #title> 使用方法 </template>
    <div>
      <a-tabs default-active-key="1">
        <a-tab-pane key="1" title="sing-box">
          <a-typography-title :heading="4">一键脚本</a-typography-title>
          <a-typography-title :heading="5">安装正式版</a-typography-title>
          <a-typography-text code>
            bash -c "$(curl -L sing-box.vercel.app)" @ install
          </a-typography-text code>
          <a-typography-title :heading="5">安装预发布版</a-typography-title>
          <a-typography-text code>
            bash -c "$(curl -L sing-box.vercel.app)" @ install --beta
          </a-typography-text code>
          <a-typography-title :heading="5">编译安装最新版</a-typography-title>
          <a-typography-text code>
            bash -c "$(curl -L sing-box.vercel.app)" @ install --go
          </a-typography-text code>
          <a-typography-title :heading="5">卸载</a-typography-title>
          <a-typography-text code>
            bash -c "$(curl -L sing-box.vercel.app)" @ remove
          </a-typography-text code>
          <a-typography-title :heading="5">编辑配置</a-typography-title>
          <a-typography-text code>
            nano /usr/local/etc/sing-box/config.json
          </a-typography-text code>
          <a-typography-title :heading="5">运行</a-typography-title>
          <a-typography-text code>
            sing-box run -c /usr/local/etc/sing-box/config.json
          </a-typography-text code>
          <a-typography-title :heading="5">后台运行</a-typography-title>
          <a-typography-text code>
            nohup sing-box run -c /usr/local/etc/sing-box/config.json &
          </a-typography-text code>
        </a-tab-pane>
        <a-tab-pane key="2" title="xray">
          <a-typography-title :heading="5">安装 xray</a-typography-title>
          <a-typography-text code>
            bash -c "$(curl -L https://github.com/XTLS/Xray-install/raw/main/install-release.sh)" @ install
          </a-typography-text code>
          <a-typography-title :heading="5">卸载 xray</a-typography-title>
          <a-typography-text code>
            bash -c "$(curl -L https://github.com/XTLS/Xray-install/raw/main/install-release.sh)" @ remove --purge
          </a-typography-text code>
          <a-typography-text type="warning">
            注意：`--purge` 选项会删除配置文件。如果只想删除程序而不删除配置，请移除 `--purge`。
          </a-typography-text>
          <a-typography-title :heading="5">编辑配置</a-typography-title>
          <a-typography-text code>
            nano /usr/local/etc/xray/config.json
          </a-typography-text code>
          <a-typography-title :heading="5">重启 xray</a-typography-title>
          <a-typography-text code>
            systemctl restart xray
          </a-typography-text code>
          <a-typography-title :heading="5">停止 xray</a-typography-title>
          <a-typography-text code>
            systemctl stop xray
          </a-typography-text code>
          <a-typography-title :heading="5">检查 xray</a-typography-title>
          <a-typography-text code>
            systemctl status xray
          </a-typography-text code>
          <a-typography-title :heading="5">查看 xray 日志</a-typography-title>
          <a-typography-text code>
            journalctl -u xray -e --no-pager
          </a-typography-text code>
        </a-tab-pane>
      </a-tabs>
    </div>
  </a-drawer>


</template>

<script setup>
import { ref, onMounted, reactive, markRaw, computed, onBeforeUnmount } from "vue";
import { Message } from '@arco-design/web-vue';
import VlessRealityVisionTab from "../../components/vless-reality-vision.vue";
import Shadowsocks from "../../components/shadowsocks.vue";


// 抽屉显示
const configDrawerVisible = ref(false);
const usageDrawerVisible = ref(false);

// 响应式窗口宽度
const windowWidth = ref(window.innerWidth);

// 监听窗口大小变化
const handleResize = () => {
  windowWidth.value = window.innerWidth;
};

// 计算抽屉宽度
const configDrawerWidth = computed(() => {
  return windowWidth.value < 768 ? '90%' : '70%';
});

const usageDrawerWidth = computed(() => {
  return windowWidth.value < 768 ? '90%' : '30%';
});

// tabs 数据
const tabsData = ref([
  {
    key: "1",
    title: "vless reality vision",
    component: markRaw(VlessRealityVisionTab),
    data: {
      port: 10000,
      uuid: "",
      short_id: [],
      sni: "www.itunes.com",
      dest: "itunes.com:443",
      private_key: "",
      public_key: "",
      remark: "vless-reality-vision-in",
      fp: "chrome",
    },
  },
  {
    key: "2",
    title: "shadowsocks",
    component: markRaw(Shadowsocks),
    data: {
      port: 10001,
      remark: "shadowsocks-in",
      method: "2022-blake3-aes-128-gcm",
      password: "",
    },
  },
]);

// 配置
const singBoxConfigStr = ref("");
const xrayConfigStr = ref("");

// 模板
const singBoxConfigTemplate = reactive({
  log: {
    level: "info",
  },
  inbounds: [],
  outbounds: [
    { type: "direct", tag: "direct" },
    { type: "block", tag: "block" },
  ],
  route: {
    rule_set: [],
    rules: [],
    final: "direct",
  },
});
const xrayConfigTemplate = reactive({
  log: {
    level: "warning",
  },
  inbounds: [],
  outbounds: [
    {
      protocol: "freedom",
      tag: "direct",
    },
    {
      protocol: "blackhole",
      tag: "blocked",
    },
  ],
  routing: {
    rules: [
      {
        type: "field",
        ip: ["geoip:private"],
        outboundTag: "blocked",
      },
      {
        type: "field",
        protocol: ["bittorrent"],
        outboundTag: "blocked",
      },
    ],
  },
});

onMounted(() => {
  window.addEventListener('resize', handleResize);
});

onBeforeUnmount(() => {
  window.removeEventListener('resize', handleResize);
});

// 查看配置
const onHandlerViewConfig = () => {
  singBoxConfigTemplate.inbounds = [];
  xrayConfigTemplate.inbounds = [];

  tabsData.value.forEach((tab) => {
    const tabData = tab.data;
    if (tab.title === "vless reality vision") {
      singBoxConfigTemplate.inbounds.push({
        type: "vless",
        tag: tabData.tag,
        listen: "::",
        listen_port: tabData.port,
        users: [{ uuid: tabData.uuid, flow: "xtls-rprx-vision" }],
        tls: {
          enabled: true,
          server_name: tabData.sni,
          reality: {
            enabled: true,
            handshake: {
              server: tabData.sni,
              server_port: 443,
            },
            private_key: tabData.private_key,
            short_id: tabData.short_id,
          },
        },
      });
      xrayConfigTemplate.inbounds.push({
        port: tabData.port,
        protocol: "vless",
        settings: {
          clients: [
            {
              id: tabData.uuid,
              flow: "xtls-rprx-vision",
              email: "vless-in",
            },
          ],
          decryption: "none",
        },
        streamSettings: {
          network: "tcp",
          security: "reality",
          realitySettings: {
            show: true,
            dest: tabData.dest,
            serverNames: [tabData.sni],
            privateKey: tabData.private_key,
            shortId: tabData.short_id,
            xver: 0,
          },
        },
      });
    }
    if (tab.title === "shadowsocks") {
      singBoxConfigTemplate.inbounds.push({
        type: "shadowsocks",
        tag: tabData.tag,
        listen: "::",
        listen_port: tabData.port,
        method: tabData.method,
        password: tabData.password,
      });
      xrayConfigTemplate.inbounds.push({
        port: tabData.port,
        protocol: "shadowsocks",
        settings: {
          method: tabData.method,
          password: tabData.password,
          network: "tcp,udp",
        },
        tag: tabData.tag,
      });
    }
  });

  singBoxConfigStr.value = JSON.stringify(singBoxConfigTemplate, null, 2);
  xrayConfigStr.value = JSON.stringify(xrayConfigTemplate, null, 2);
  configDrawerVisible.value = true;
};

// 复制配置到剪贴板
const copyConfig = (type) => {
  let configText = '';
  
  if (type === 'singbox') {
    configText = singBoxConfigStr.value;
  } else if (type === 'xray') {
    configText = xrayConfigStr.value;
  }
  
  if (configText) {
    navigator.clipboard.writeText(configText)
      .then(() => {
        Message.success('配置已复制到剪贴板');
      })
      .catch(err => {
        console.error('复制失败:', err);
        Message.error('复制失败，请手动复制');
      });
  }
};

// 新增协议
const handleSelectProtocol = (v) => {
  console.log(v);
};
</script>
