<template>
  <bar-left></bar-left>
  <div class="pageBox">
    <router-view />
  </div>
</template>

<script setup lang="ts">
import BarLeft from '../components/BarLeft.vue';
import { onMounted } from 'vue';
import { ipcRenderer } from 'electron';
import Database from 'better-sqlite3';
import knex from 'knex';
onMounted(() => {
  ipcRenderer.invoke('showWindow');

  console.log('knex', knex);
  console.log('better-sqlite3', Database);
});
</script>

<style scoped lang="scss">
.pageBox {
  flex: 1;
  height: 100%;
  border-top: 1px solid #e6e6e6;
  box-sizing: border-box;
  display: flex;
  margin-top: -1px;
}
</style>
