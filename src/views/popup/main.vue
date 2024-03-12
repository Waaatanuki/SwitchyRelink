<script setup lang="ts">
import { profileList } from '~/logic'

const model = ref('')
const config = ref<any>()
const modelList = ref([
  { label: '直接连接', key: 'direct' },
  { label: '系统代理', key: 'system' },
])

function onChange(modelName: string) {
  model.value = modelName

  browser.proxy.settings.set({ value: { mode: model.value }, scope: 'regular' })
}
// {"levelOfControl":"controlled_by_this_extension","value":{"mode":"system"}}
// { "levelOfControl": "controllable_by_this_extension", "value": { "mode": "system" } }
async function foo() {
  config.value = JSON.stringify(await browser.proxy.settings.get({ incognito: false }))
}

function openSetting() {
  browser.runtime.openOptionsPage()
}

onMounted(async () => {
  config.value = await browser.proxy.settings.get({})
  model.value = config.value.value.mode
})
</script>

<template>
  <div w-50 flex flex-col>
    <el-check-tag
      v-for="tag in modelList" :key="tag.key"
      :checked="model === tag.key" type="primary" @change="onChange(tag.key)"
    >
      {{ tag.label }}
    </el-check-tag>

    <div btn @click="foo">
      测试
    </div>
    {{ config }}
    <div btn @click="openSetting">
      选项
    </div>
  </div>
</template>

<style scoped>

</style>
