<script setup lang="ts">
import type { Mode, ProxyConfig } from '~/logic'
import { currentProfileId, profileList } from '~/logic'

const defaultProfileList = ref<{ label: string, mode: Mode }[]>([
  { label: '直接连接', mode: 'direct' },
  { label: '系统代理', mode: 'system' },
])

function onChange(id: string, config: ProxyConfig) {
  currentProfileId.value = id
  browser.proxy.settings.set({ value: config })
  if (['direct', 'system'].includes(id))
    browser.action.setIcon({ path: `/assets/logo_${id}.png` })
  else
    browser.action.setIcon({ path: `/assets/logo_custom.png` })
}

function openSetting() {
  browser.runtime.openOptionsPage()
}

onMounted(async () => {
  const config = await browser.proxy.settings.get({})
  if (['direct', 'system'].includes(config.value.mode)) {
    currentProfileId.value = config.value.mode
    browser.action.setIcon({ path: `/assets/logo_${config.value.mode}.png` })
  }
})
</script>

<template>
  <div w-130px flex flex-col>
    <el-check-tag
      v-for="tag in defaultProfileList" :key="tag.mode"
      :checked="currentProfileId === tag.mode" type="primary" @change="onChange(tag.mode, { mode: tag.mode })"
    >
      <div text-center>
        {{ tag.label }}
      </div>
    </el-check-tag>

    <div border-t-1 />

    <el-check-tag
      v-for="profile in profileList" :key="profile.form.id"
      :checked="currentProfileId === profile.form.id" type="primary" @change="onChange(profile.form.id, profile.config)"
    >
      <div text-center>
        {{ profile.form.name }}
      </div>
    </el-check-tag>

    <div border-t-1 />

    <el-check-tag type="warning" @change="openSetting">
      <div text-center>
        选项
      </div>
    </el-check-tag>
  </div>
</template>
