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
        external: ['electron']
      });

      //preload编译
      // require('esbuild').buildSync({
      //   entryPoints: ['./src/main/preload.ts'],
      //   bundle: true,
      //   platform: 'node',
      //   outfile: './dist/preload.js',
      //   external: ['electron'],
      // });

      //挂载监听
      server.httpServer?.once('listening', () => {
        //当viteDev开始监听的时候,启动electron子服务,监听这个
        let { spawn } = require('child_process');
        // spawn('执行程序',['隐含参数0 就是可执行程序的地址 在这里就是eletron的执行文件的路径 会自动加入到这里',‘参数1','参数2',...],{ options })
        let addressInfo = server.httpServer.address();
        if (typeof addressInfo != 'string') {
          console.log(addressInfo);
          // console.log(process);

          let electronProcess = spawn(
            require('electron').toString(),
            //参数1   入口文件 argv[1]      参数2   server地址    window,loadurl(argv[2]) 的由来
            ['./dist/mainEntry.js', `http://${addressInfo.address}:${addressInfo.port}`],
            {
              // 当前执行地址
              cwd: process.cwd(),
              // 继承输出到主进程     inherit 继承
              stdio: 'inherit'
            }
          );

          //监听electron子进程close事件
          electronProcess.on('close', () => {
            // 关闭viteDev
            server.close();
            //关闭进程
            process.exit();
          });
        }
      });
    }
  };
};

//只是导出  vite-plugin-optimizer  的 配置而已
export let getReplace = () => {
  // 外部模块注册   web中使用node和electron
  let externalModels = ['os', 'fs', 'path', 'events', 'child_process', 'crypto', 'http', 'buffer', 'url', 'better-sqlite3', 'knex'];
  let result = {};

  // result = {
  //   os: () => ({ find: new RegExp('^os$'), code: `const os = requrie('os');export { os as default }` }),
  // };

  for (let item of externalModels) {
    result[item] = () => {
      return {
        find: new RegExp(`^${item}$`),
        code: `const ${item.replace(/-/g, '_')} = require('${item}');export { ${item.replace(/-/g, '_')} as default }`
        // code: `const ${item} = require('${item}');export default ${item} `,
      };
    };
  }

  result['electron'] = () => {
    // 需要导出的模块
    let electronModules = ['clipboard', 'ipcRenderer', 'nativeImage', 'shell', 'webFrame'];

    return {
      find: new RegExp('^electron$'),
      code: ` const { ${electronModules} } = require('electron') ; export { ${electronModules} }  `
    };
  };

  return result;
};

// 导出的 result 结构

// const result = {
//   // 第一种写法
//   //  会生成一个js文件  当代码中出现 import { ipcRender } from ‘electron’
//   // 会引入这个js  所以
//   electron: ` const { ipcRender }  = require('electron') ; export { ipcrender }  `,

//   //第二种写法
//   fs: () => {
//     return {
//       // 这个会匹配  node:fs 和 fs    当 import fs
//       find: new RegExp('^(node:)?fs$'),
//       code: `const fs = require('fs'); export { fs as default }`,
//     };
//   },
// };

// vite-plugin-optimizer
// 关于这个插件的具体使用
