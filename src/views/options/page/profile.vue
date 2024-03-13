<script setup lang="ts">
import { profileList } from '~/logic'

const form = reactive({
  id: '',
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

function resetForm() {
  form.id = ''
  form.name = ''
  form.mode = 'pac_script'
  form.url = ''
  form.script = ''
}

function onSubmit() {
  const config = {
    mode: form.mode,
    pacScript: {
      data: form.script,
    },
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

      default:
        break
    }
  }
  else {
    resetForm()
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
