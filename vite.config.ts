import { defineConfig } from 'vite';
import { devPlugin, getReplace } from './plugins/devPlugin';
import { buildPlugin } from './plugins/buildPlugin';
import vue from '@vitejs/plugin-vue';
import optimizer from 'vite-plugin-optimizer';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [optimizer(getReplace()), devPlugin(), vue()],
  build: {
    rollupOptions: {
      plugins: [buildPlugin()],
    },
    // 关闭小文件转换base64    转换可以减少请求的发送 但是electron中是本地请求,反而会增加编译与解析的时间
    assetsInlineLimit: 0,
  },
});
