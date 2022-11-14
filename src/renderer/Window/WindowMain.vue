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
import { db } from '../../common/db';
import naive from 'naive';

onMounted(() => {
  ipcRenderer.invoke('showWindow');

  db('Chat')
    .first()
    .then((obj) => {
      console.log(obj);
    });

  // const naive = require('naive');

  // console.log(require('bindings')('naive').readFilePaths());
  console.log(require('bindings')('naive.node'));
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
