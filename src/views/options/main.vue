<script lang="ts" setup>
import Home from './page/home.vue'
import About from './page/about.vue'
import Profile from './page/profile.vue'
import NotFound from './page/404.vue'
import { profileList } from '~/logic'

const routes: { [key: string]: any } = {
  '/': Home,
  '/profile': Profile,
  '/about': About,
}

const currentPath = ref(window.location.hash)

window.addEventListener('hashchange', () => {
  currentPath.value = window.location.hash
})

const currentView = computed(() => {
  return routes[`/${currentPath.value.split('/')[1] || ''}`] || NotFound
})
</script>

<template>
  <div flex gap-10px>
    <div w-200px shrink-0 py-10px>
      <div mb-20px flex items-center justify-start gap-10px pl-10px text-xl>
        <div i-carbon:settings />设置
      </div>

      <div flex flex-col>
        <a href="#/" :class="{ active: currentPath === '#/' || currentPath === '' }" menu-item>
          <div i-carbon:earth-americas-filled />
          通用
        </a>
        <el-divider />
        <a v-for="profile, idx in profileList" :key="idx" :href="`#/profile/${profile.name}`" :class="{ active: currentPath === `#/profile/${profile.name}` }" menu-item>
          <div i-carbon:ibm-cloud-bare-metal-server />
          {{ profile.name }}
        </a>
        <a href="#/profile" :class="{ active: currentPath === '#/profile' }" menu-item>
          <div i-carbon:new-tab />
          新增情景模式
        </a>
        <el-divider />
        <a href="#/about" :class="{ active: currentPath === '#/about' }" menu-item>
          <div i-carbon:information />
          关于
        </a>
      </div>
    </div>

    <div p-20px>
      <component :is="currentView" />
    </div>
  </div>
</template>

<style>
.active{
  background-color: skyblue !important;
}
</style>
