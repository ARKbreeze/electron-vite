<template>
  <BarTop></BarTop>
  <p>setting-view</p>
  <button @click="sendMessage">click me</button>
</template>

<script setup lang="ts">
import BarTop from '../components/BarTop.vue';
import { dialogReady } from '../common/Dialog';
import { onMounted } from 'vue';

// 挂载结束 发送准备完成消息
onMounted(() => dialogReady());

// 发送消息
let sendMessage = () => {
  window.opener.postMessage({ msg: "i'm your son" });
};

// 接收消息
window.addEventListener('message', (e) => {
  console.log(e.data);
});
</script>

<style scoped></style>
