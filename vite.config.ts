import { defineConfig } from 'vite';
import { devPlugin, getReplace } from './plugins/devPlugin';
import vue from '@vitejs/plugin-vue';
import optimizer from 'vite-plugin-optimizer';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [optimizer(getReplace()), devPlugin(), vue()],
});
