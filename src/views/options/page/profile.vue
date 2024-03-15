<script setup lang="ts">
import type { Form, ProxyConfig, Scheme, ServerRule } from '~/logic'
import { profileList } from '~/logic'

const defaultServerRules = [
  { protocol: '默认', scheme: 'direct', host: '', port: '' },
  { protocol: 'http://', scheme: 'default', host: '', port: '' },
  { protocol: 'https://', scheme: 'default', host: '', port: '' },
  { protocol: 'ftp://', scheme: 'default', host: '', port: '' },
]

const schemeList = [
  { label: 'HTTP', key: 'http', port: 80 },
  { label: 'HTTPS', key: 'https', port: 443 },
  { label: 'SOCKS4', key: 'socks4', port: 1080 },
  { label: 'SOCKS5', key: 'socks5', port: 1080 },
]

const form = reactive<Form>({
  id: '',
  name: '',
  mode: '' as 'direct' | 'auto_detect' | 'pac_script' | 'fixed_servers' | 'system',
  url: '',
  script: '',
  serverRules: [],
  bypassText: '127.0.0.1\n[::1]\nlocalhost',
  bypassList: ['127.0.0.1', '[::1]', 'localhost'],
})

function getPacScript() {
  fetch(form.url!)
    .then(response => response.text())
    .then((contents) => {
      form.script = contents
    })
    .catch((error) => {
      ElMessage.error(error)
    })
}

function handleSchemeChange(row: ServerRule) {
  if (['direct', 'default'].includes(row.scheme)) {
    row.host = ''
    row.port = ''
  }

  const hit = schemeList.find(s => s.key === row.scheme)
  if (hit) {
    row.port = String(hit.port)
    row.host = row.host || 'example.com'
  }
}

function handleBypassChange(text: string) {
  form.bypassList = text.split('\n')
}

function resetForm() {
  form.id = ''
  form.name = ''
  form.mode = 'pac_script'
  form.url = ''
  form.script = ''
  form.serverRules = [...defaultServerRules]
  form.bypassText = '127.0.0.1\n[::1]\nlocalhost'
  form.bypassList = ['127.0.0.1', '[::1]', 'localhost']
}

function onSubmit() {
  const config: ProxyConfig = { mode: form.mode }

  if (form.mode === 'pac_script')
    config.pacScript = { url: form.url }

  if (form.mode === 'fixed_servers') {
    config.rules = { bypassList: form.bypassList }

    const defaultRule = form.serverRules.find(r => r.protocol === '默认')!
    const httpRule = form.serverRules.find(r => r.protocol === 'http://')!
    const httpsRule = form.serverRules.find(r => r.protocol === 'https://')!
    const ftpRule = form.serverRules.find(r => r.protocol === 'ftp://')!

    if (defaultRule?.scheme !== 'direct') {
      if (httpRule?.scheme === 'default' && httpsRule?.scheme === 'default' && ftpRule?.scheme === 'default') {
        config.rules!.singleProxy = {
          host: defaultRule.host,
          port: Number(defaultRule.port),
          scheme: defaultRule.scheme as Scheme,
        }
      }
      else {
        config.rules.fallbackProxy = {
          host: defaultRule.host,
          port: Number(defaultRule.port),
          scheme: defaultRule.scheme as Scheme,
        }
      }
    }
    if (httpRule?.scheme !== 'default') {
      config.rules.proxyForHttp = {
        host: httpRule.host,
        port: Number(httpRule.port),
        scheme: httpRule.scheme as Scheme,
      }
    }

    if (httpsRule?.scheme !== 'default') {
      config.rules.proxyForHttps = {
        host: httpsRule.host,
        port: Number(httpsRule.port),
        scheme: httpsRule.scheme as Scheme,
      }
    }
    if (ftpRule?.scheme !== 'default') {
      config.rules.proxyForFtp = {
        host: ftpRule.host,
        port: Number(ftpRule.port),
        scheme: ftpRule.scheme as Scheme,
      }
    }

    for (const value of Object.values(config.rules!))
      delete value.protocol
  }

  if (form.id) {
    const hit = profileList.value.find(p => p.form.id === form.id)!
    hit.form = { ...form }
    hit.config = config
  }
  else {
    const id = Number(profileList.value.at(-1)?.form.id || '0')

    profileList.value.push({
      form: { ...form, id: String(id + 1) },
      config,
    })
  }
  backHome()
}

function backHome() {
  window.location.replace('/src/views/options/main.html')
}

function init() {
  const id = window.location.hash.split('/')[2]
  if (id) {
    const hit = profileList.value.find(p => p.form.id === id)
    switch (hit?.config.mode) {
      case 'pac_script':
        form.id = hit.form.id
        form.name = hit.form.name
        form.mode = hit.form.mode
        form.url = hit.form.url ?? ''
        form.script = hit.form.script ?? ''
        break
      case 'fixed_servers':
        form.id = hit.form.id
        form.name = hit.form.name
        form.mode = hit.form.mode
        form.serverRules = JSON.parse(JSON.stringify(hit.form.serverRules))
        form.bypassText = hit.form.bypassText
        form.bypassList = [...hit.form.bypassList]
        break
      default:
        break
    }
  }
  else {
    resetForm()
  }
}

window.addEventListener('hashchange', () => { init() })

onMounted(() => { init() })
</script>

<template>
  <el-form :model="form" label-width="120" label-position="top">
    <el-form-item label="情景模式名称" max-w-100>
      <el-input v-model="form.name" />
    </el-form-item>
    <el-form-item label="类型">
      <el-radio-group v-model="form.mode">
        <el-radio-button label="PAC情景模式" value="pac_script" />
        <el-radio-button label="代理服务器" value="fixed_servers" />
        <el-radio-button label="自动切换模式" value="auto_detect" />
      </el-radio-group>
    </el-form-item>
    <template v-if="form.mode === 'pac_script'">
      <el-form-item label="PAC网址">
        <div flex gap-10px>
          <el-input v-model="form.url" style="width:300px" clearable />
          <el-button type="success" @click="getPacScript">
            获取脚本
          </el-button>
        </div>
      </el-form-item>
      <el-form-item label="PAC脚本" max-w-150>
        <el-input v-model="form.script" type="textarea" :rows="10" disabled />
      </el-form-item>
    </template>
    <template v-if="form.mode === 'fixed_servers'">
      <el-form-item label="代理服务器">
        <el-table :data="form.serverRules" style="width:600px">
          <el-table-column prop="protocol" label="网址协议" width="100" />
          <el-table-column prop="scheme" label="代理协议" width="150">
            <template #default="{ row, $index }">
              <el-select v-model="row.scheme" @change="handleSchemeChange(row)">
                <el-option v-if="$index === 0" label="直接连接" value="direct" />
                <el-option v-else label="同默认" value="default" />
                <el-option v-for="op in schemeList" :key="op.key" :label="op.label" :value="op.key" />
              </el-select>
            </template>
          </el-table-column>
          <el-table-column prop="host" label="代理服务器">
            <template #default="{ row }">
              <el-input v-model="row.host" :disabled="['direct', 'default'].includes(row.scheme)" />
            </template>
          </el-table-column>
          <el-table-column prop="port" label="代理端口" width="100">
            <template #default="{ row }">
              <el-input v-model="row.port" :disabled="['direct', 'default'].includes(row.scheme)" />
            </template>
          </el-table-column>
        </el-table>
      </el-form-item>
      <el-form-item label="不代理的地址列表" max-w-150>
        <el-alert type="info" show-icon :closable="false">
          不经过代理连接的主机列表: (每行一个主机)
        </el-alert>
        <el-input v-model="form.bypassText" type="textarea" :rows="10" @change="handleBypassChange" />
      </el-form-item>
    </template>
    <el-form-item>
      <div w-full flex justify-start>
        <div>
          <el-button type="primary" @click="onSubmit">
            确认
          </el-button>
          <el-button @click="backHome">
            取消
          </el-button>
        </div>
      </div>
    </el-form-item>
  </el-form>
</template>
