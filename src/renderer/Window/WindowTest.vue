<template>
  <div class="testPage">
    <BarTop></BarTop>
    <div class="testBox">
      <h2>test-view</h2>
      <div>
        <h3>state-options</h3>
        <p>{{ useOptionsTestStore().counter }}</p>
        <button @click="useOptionsTestStore().increment">++</button>
        <button @click="useOptionsTestStore().decrement">--</button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import BarTop from '../components/BarTop.vue';
import { dialogReady } from '../common/Dialog';
import { onMounted } from 'vue';
import { useOptionsTestStore } from '../store/useChatStore';

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

<style scoped lang="scss">
.testPage {
  display: flex;
  width: 100%;
  flex-direction: column;
  flex: 1;

  .testBox {
    width: fit-content;
  }
}
</style>
