<script setup>
import { onMounted } from 'vue'
import AppHeader from '@/components/layout/AppHeader.vue'
import AppFooter from '@/components/layout/AppFooter.vue'

onMounted(() => {
  // Set page title
  document.title = 'Truyện Của Phúc - Website Đọc Truyện Truyện Online'
})
</script>

<template>
  <div class="page-wrapper">
    <AppHeader />
    <main class="main-content">
      <RouterView />
    </main>
    <AppFooter />
  </div>
</template>

<style>
/* Global styles are imported in main.css */
</style>
