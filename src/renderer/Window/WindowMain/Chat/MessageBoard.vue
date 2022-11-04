<script setup lang="ts">
import BarTop from '../../../components/BarTop.vue';
import MessageItem from './MessageItem.vue';
import { ref } from 'vue';
import { useChatStore } from '../../../store/useChatStore';
import { useMessageStore } from '../../../store/useMessageStore';
const messageStore = useMessageStore();
// ----------------------  订阅chatStore select数据变化
// import { ModelChat } from '../../../../model/ModelChat';
// const chatStore = useChatStore();
// let logInfo = ref('');
// let curId = '';

//  //订阅chatStore select数据变化    mutations 上下文  state 把store传过来了
// chatStore.$subscribe((mutations, state) => {
//   let item = state.data.find((item) => item.isSelected == true) as ModelChat;
//   let id = item?.id ?? '';
//   if (id != curId) {
//     logInfo.value = `现在应该家在id${id}的聊天记录`;
//     curId = id;
//   }
// });
// ----------------------
</script>
<template>
  <div class="MessageBord">
    <BarTop />
    <div class="MessageList">
      <!-- <p>{{ logInfo }}</p> -->
      <MessageItem v-for="item in messageStore['data']" :data="item" :key="item.id"></MessageItem>
    </div>
  </div>
</template>
<style scoped lang="scss">
.MessageBord {
  height: 100%;
  display: flex;
  flex: 1;
  flex-direction: column;
}
.MessageList {
  flex: 1;
  overflow-y: auto;
  overflow-x: hidden;
  background: rgb(245, 245, 245);
}
</style>
