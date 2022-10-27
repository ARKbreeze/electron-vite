//导入vite的sever服务
import { ViteDevServer } from 'vite';

// 整合electron热更新
export let devPlugin = () => {
  // 插件需要返回一个对象
  return {
    //插件名称
    name: 'dev-plugin',
    // 约定?   参数为ViteDevServer
    configureServer(server: ViteDevServer) {
      //esbuild打包    同步
      require('esbuild').buildSync({
        //入口
        entryPoints: ['./src/main/mainEntry.ts'],
        //打包
        bundle: true,
        //平台
        platform: 'node',
        //出口
        outfile: './dist/mainEntry.js',
        //
        external: ['electron'],
      });

      //挂载监听
      server.httpServer?.once('listening', () => {
        //当viteDev开始监听的时候,启动electron子服务,监听这个
        let { spawn } = require('child_process');
        // spawn('执行程序',['隐含参数0 就是可执行程序的地址 在这里就是eletron的执行文件的路径 会自动加入到这里',‘参数1','参数2',...],{ options })
        let electronProcess = spawn(
          require('electron').toString(),
          //参数1   入口文件 argv[1]      参数2   server地址    window,loadurl(argv[2]) 的由来
          ['./dist/mainEntry.js', `http://127.0.0.1:${server.config.server.port}`],
          {
            // 当前执行地址
            cwd: process.cwd(),
            // 继承输出到主进程     inherit 继承
            stdio: 'inherit',
          }
        );

        //
        electronProcess.on('close', () => {
          server.close();
          process.exit();
        });
      });
    },
  };
};
