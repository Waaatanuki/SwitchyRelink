<script setup lang="ts">
import type { Mode, ProxyConfig } from '~/logic'
import { currentProfileId, profileList } from '~/logic'

const defaultProfileList = ref<{ label: string, mode: Mode }[]>([
  { label: '直接连接', mode: 'direct' },
  { label: '系统代理', mode: 'system' },
])

async function onChange(id: string, config: ProxyConfig) {
  currentProfileId.value = id
  await browser.proxy.settings.set({ value: JSON.parse(JSON.stringify(config)) })
  await setIcon()
  browser.tabs.reload()
}

function openSetting() {
  browser.runtime.openOptionsPage()
}
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
