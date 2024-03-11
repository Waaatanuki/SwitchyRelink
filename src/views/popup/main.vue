<script setup lang="ts">
const model = ref('')

const modelList = ref([
  { label: '直接连接', key: 'direct' },
  { label: '系统代理', key: 'system' },
  { label: 'ACGP', key: 'acgp' },
])

function onChange(modelName: string) {
  model.value = modelName
}

function foo() {
  chrome.proxy.settings.get(
    { incognito: false },
    (config) => {
      console.log(JSON.stringify(config))
    },
  )
}
</script>

<template>
  <div w-50 flex flex-col>
    <el-check-tag
      v-for="tag in modelList" :key="tag.key"
      :checked="model === tag.key" type="primary" @change="onChange(tag.key)"
    >
      {{ tag.label }}
    </el-check-tag>

    <div @click="foo">
      测试
    </div>
  </div>
</template>

<style scoped>

</style>
