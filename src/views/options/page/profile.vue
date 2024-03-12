<script setup lang="ts">
import { profileList } from '~/logic'

const form = reactive({
  name: '',
  mode: '' as 'direct' | 'auto_detect' | 'pac_script' | 'fixed_servers' | 'system',
  url: '',
  script: '',
})

function getPacScript() {
  fetch(form.url)
    .then(response => response.text())
    .then((contents) => {
      form.script = contents
    })
    .catch((error) => {
      ElMessage.error(error)
    })
}

function onSubmit() {
  const config = {
    mode: form.mode,
    pacScript: {
      data: form.script,
    },
  }

  profileList.value.push({
    name: form.name,
    config,
  })

  browser.proxy.settings.set({ value: config, scope: 'regular' })
  // window.location.replace('/src/views/options/main.html')
}

function init() {
  const name = window.location.hash.split('/')[2]
  if (name) {
    const hit = profileList.value.find(profile => profile.name === name)
    console.log(hit)
  }
}

window.addEventListener('hashchange', () => {
  init()
})

onMounted(() => {
  init()
})
</script>

<template>
  <el-form :model="form" label-width="120">
    <el-form-item label="情景模式名称">
      <el-input v-model="form.name" />
    </el-form-item>
    <el-form-item label="类型">
      <el-radio-group v-model="form.mode">
        <el-radio-button label="代理服务器" value="fixed_servers" />
        <el-radio-button label="PAC情景模式" value="pac_script" />
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
      <el-form-item label="PAC脚本" w-full>
        <el-input v-model="form.script" type="textarea" :rows="10" disabled />
      </el-form-item>
    </template>
    <el-form-item>
      <div w-full flex justify-end>
        <div>
          <el-button type="primary" @click="onSubmit">
            确认
          </el-button>
          <el-button>取消</el-button>
        </div>
      </div>
    </el-form-item>
  </el-form>
</template>
