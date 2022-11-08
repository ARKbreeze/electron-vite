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

onMounted(() => {
  ipcRenderer.invoke('showWindow');
  const Database = require('better-sqlite3');
  const db = new Database('db.db', { verbose: console.log, nativeBinding: './node_modules/better-sqlite3/build/Release/better_sqlite3.node' });
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
