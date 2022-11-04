<template>
  <div class="BarLeft">
    <div class="userIcon">
      <img src="../assets/avatar.jpg" alt="" srcset="" />
    </div>
    <div class="menu">
      <router-link v-for="item in mainWindowRoutes" :to="item.path" :class="['menuItem', { selected: item.isSelected }]" :key="item.path">
        <i :class="['icon', item.isSelected ? item.iconSelected : item.icon]"></i>
      </router-link>
    </div>
    <div class="setting">
      <div class="menuItem">
        <i class="icon icon-setting" @click="openTestWindow"></i>
      </div>
      <div class="menuItem">
        <i class="icon icon-setting" @click="openSettingWindow"></i>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { BrowserWindowConstructorOptions } from 'electron';
import { ref, watch } from 'vue';
import { useRoute } from 'vue-router';
import { createDialog } from '../common/Dialog';

let mainWindowRoutes = ref([
  { path: '/WindowMain/Chat', isSelected: true, icon: 'icon-chat1', iconSelected: 'icon-chat' },
  { path: '/WindowMain/Contact', isSelected: false, icon: 'icon-tongxunlu1', iconSelected: 'icon-tongxunlu' },
  { path: '/WindowMain/Collection', isSelected: false, icon: 'icon-shoucang1', iconSelected: 'icon-shoucang' }
]);

let route = useRoute();

// watch  (source,callback,options)
watch(
  () => route,
  () => mainWindowRoutes.value.forEach((item) => (item.isSelected = item.path === route.fullPath)),
  { immediate: true, deep: true }
);

let openSettingWindow = async () => {
  let config: BrowserWindowConstructorOptions = {
    modal: true,
    width: 800,
    webPreferences: {
      webviewTag: false,
      devTools: true
    }
  };
  // window.open('/WindowSetting/AccountSetting', '_black', JSON.stringify(config));
  const subWindow = await createDialog('/WindowSetting/AccountSetting', config);
  subWindow.postMessage({ msg: "i'm you father" });
};

let openTestWindow = async () => {
  const subWindow = await createDialog('/WindowTest', {});
};

window.addEventListener('message', (e) => {
  console.log(e.data);
});
</script>

<style scoped lang="scss">
.BarLeft {
  width: 54px;
  height: 100%;
  display: flex;
  flex-direction: column;
  background: rgb(46, 46, 46);
  -webkit-app-region: drag;
}
.userIcon {
  height: 84px;
  padding-top: 36px;
  box-sizing: border-box;
  img {
    width: 34px;
    height: 34px;
    margin-left: 10px;
  }
}
.menu {
  flex: 1;
}
.menuItem {
  height: 44px;
  line-height: 44px;
  text-align: center;
  padding-left: 12px;
  padding-right: 12px;
  display: block;
  text-decoration: none;
  color: rgb(126, 126, 126);
  cursor: pointer;
  -webkit-app-region: no-drag;
  i {
    font-size: 22px;
  }
  &:hover {
    color: rgb(141, 141, 141);
  }
}
.selected {
  color: rgb(7, 193, 96);
  &:hover {
    color: rgb(7, 193, 96);
  }
}
.setting {
  margin-bottom: 5px;
}
</style>
