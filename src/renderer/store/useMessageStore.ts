import { ModelMessage } from '../../model/ModelMessage';
import { ModelChat } from '../../model/ModelChat';
import { defineStore } from 'pinia';
import { ref } from 'vue';

export const useMessageStore = defineStore('message', () => {
  let data = ref<ModelMessage[]>([]);

  let msgIn = `in message`;
  let msgOut = `out message`;

  let initData = (chat: ModelChat) => {
    let result: Array<ModelMessage> = [];
    for (let i = 0; i < 10; i++) {
      let model = new ModelMessage();
      model.createTime = Date.now();
      model.isInMsg = i % 2 === 0;
      model.chatId = chat.id;
      model.avatar = chat.avatar;
      model.messageContent = model.isInMsg ? msgIn : msgOut;
      model.fromName = model.isInMsg ? chat.fromName : 'breeze';
      result.push(model);
    }
    data.value = result;
  };

  return { data, initData };
});
