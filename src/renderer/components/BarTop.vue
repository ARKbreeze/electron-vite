<script setup lang="ts">
  import { onMounted, ref, onUnmounted } from 'vue';
  import { ipcRenderer } from 'electron';
  defineProps<{ title?: string }>();

  let isMaximized = ref(false);

  // 关闭窗口
  let closeWindow = () => {
    ipcRenderer.invoke('closeWindow');
  };
  // 最大化窗口
  let maximizeMainWindow = () => {
    ipcRenderer.invoke('maximizeWindow');
  };
  //最小化窗口
  let minimizeMainWindow = () => {
    ipcRenderer.invoke('minimizeWindow');
  };
  // 还原窗口
  let unmaximizeMainWindow = () => {
    ipcRenderer.invoke('unmaximizeWindow');
  };
  //窗口最大化事件
  let winMaximizeEvent = () => {
    isMaximized.value = true;
  };
  //窗口取消最大化事件
  let winUnmaximizeEvent = () => {
    isMaximized.value = false;
  };

  // 初始化挂载最大与还原监听
  onMounted(() => {
    //主线程操作成功后通知
    // 为什么只监听这两个  因为关闭跟最小化与你的页面无关,但是最大化与还原会影响你的页面
    ipcRenderer.on('windowMaximized', winMaximizeEvent);
    ipcRenderer.on('windowUnmaximized', winUnmaximizeEvent);
  });

  //卸载取消监听
  onUnmounted(() => {
    ipcRenderer.off('windowMaxiMized', winMaximizeEvent);
    ipcRenderer.off('windowUnmaximized', winUnmaximizeEvent);
  });
</script>

<template>
  <div class="topBar">
    <div class="winTitle">{{ title }}</div>
    <div class="winTool">
      <div @click="minimizeMainWindow">
        <i class="icon icon-minimize" />
      </div>
      <div v-if="isMaximized" @click="unmaximizeMainWindow">
        <i class="icon icon-restore" />
      </div>
      <div v-else @click="maximizeMainWindow">
        <i class="icon icon-maximize" />
      </div>
      <div @click="closeWindow">
        <i class="icon icon-close" />
      </div>
    </div>
  </div>
</template>

<style scoped lang="scss">
  .topBar {
    display: flex;
    height: 25px;
    line-height: 25px;
    -webkit-app-region: drag; /* 可拖拽区域 */
    width: 100%;
  }
  .winTitle {
    flex: 1;
    padding-left: 12px;
    font-size: 14px;
    color: #888;
  }
  .winTool {
    height: 100%;
    display: flex;
    -webkit-app-region: no-drag; /* 可拖拽区域内的不可拖拽区域 */
  }
  .winTool div {
    height: 100%;
    width: 34px;
    text-align: center;
    color: #999;
    cursor: pointer;
    line-height: 25px;
  }
  .winTool .icon {
    font-size: 10px;
    color: #666666;
    font-weight: bold;
  }
  .winTool div:hover {
    background: #efefef;
  }
  .winTool div:last-child:hover {
    background: #ff7875;
  }
  .winTool div:last-child:hover i {
    color: #fff !important;
  }
</style>
