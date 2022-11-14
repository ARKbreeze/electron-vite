import { createApp } from 'vue';
import './assets/style.css';
import './assets/icon/iconfont.css';
import App from './App.vue';
import { router } from './router';
import { createPinia } from 'pinia';
// import naive from 'naive';

const app = createApp(App);
app.use(createPinia());
app.use(router);
app.mount('#app');
