import { createApp } from 'vue';
import './assets/style.css';
import './assets/icon/iconfont.css';
import App from './App.vue';
import { router } from './router';
import { createPinia } from 'pinia';

const app = createApp(App);
app.use(createPinia());
app.use(router);
app.mount('#app');

const naive = require('../naive/build/Release/addon.node');
console.log(naive.readFilePaths());
