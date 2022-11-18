<template>
  <div class="testPage">
    <BarTop></BarTop>
    <div class="testBox">
      <h2>test-view</h2>
      <h3>version : {{ pkg.version }}</h3>
      <button @click="update">全量更新</button>
      <button @click="winIncrement">增量更新</button>
      <div>
        <h3>state-options</h3>
        <p>{{ useOptionsTestStore().counter }}</p>
        <button @click="useOptionsTestStore().increment">++</button>
        <button @click="useOptionsTestStore().decrement">--</button>
      </div>
      <div>
        <h3>state-setup</h3>
        <p>{{ useTestStore().counter }}</p>
        <button @click="useTestStore().increment">++</button>
        <button @click="useTestStore().decrement">--</button>
      </div>
      <div>
        <h3>database</h3>
        <div>
          <label>增加/修改数据的内容</label> <input type="text" v-model="db_ipt" />
          <p style="user-select: text">增加数据的id : {{ db_result }}</p>
          <button @click="addData">增加数据</button>
        </div>
        <div>
          <label for="">删除数据id</label> <input type="text" v-model="db_del_ipt" />
          <button @click="deleteData">删除数据</button>
        </div>
        <div>
          <label for="">修改数据id</label> <input type="text" v-model="db_upd_ipt" />
          <button @click="patchData">修改数据</button>
        </div>
        <div>
          <label for="">查询id</label><input type="text" v-model="db_que_ipt" />
          <button @click="queryData">查询id数据</button>
          <button @click="queryDataAll">查询所有数据</button>
          <button @click="queryDataFirst">查询第一条数据</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import BarTop from '../components/BarTop.vue';
import pkg from '../../../package.json';
import { ipcRenderer } from 'electron';
import { dialogReady } from '../common/Dialog';
import { onMounted, ref } from 'vue';
import { useOptionsTestStore, useTestStore } from '../store/useTestStore';

import { db } from '../../common/db';
import { ModelChat } from '../../model/ModelChat';

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

//database
const db_ipt = ref('');
const db_result = ref('');
const db_que_ipt = ref('');
const db_upd_ipt = ref('');
const db_del_ipt = ref('');

let addData = async () => {
  let model = new ModelChat();
  model.fromName = 'any';
  model.avatar = `https://pic3.zhimg.com/v2-306cd8f07a20cba46873209739c6395d_im.jpg?source=32738c0c`;
  model.sendTime = Date.now();
  model.lastMsg = db_ipt.value || 'default_msg';
  await db('Chat').insert(model);
  db_result.value = model.id;
};
let patchData = async () => {
  await db('Chat').update({ lastMsg: db_ipt.value }).where({ id: db_upd_ipt.value });
  db_result.value = await db('Chat').where({ id: db_upd_ipt.value }).first();
};
let queryDataFirst = async () => {
  db_result.value = await db('chat').first();
};
let queryDataAll = async () => {
  db_result.value = await db('chat');
};
let queryData = async () => {
  db_result.value = await db('chat').where({ id: db_que_ipt.value }).first();
};
let deleteData = async () => {
  await db('Chat').where({ id: db_del_ipt.value }).delete();
  db_result.value = `${db_del_ipt.value} 已删除`;
};

// 全更新
let update = () => {
  ipcRenderer.invoke('win-update');
};
// 增量更新
let winIncrement = () => {
  ipcRenderer.invoke('win-increment');
  console.log('increment');
};
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
