import fs from 'fs-extra';
import path from 'path';

export let buildPlugin = () => {
  return {
    name: 'build-plugin',
    // 结束打包回调  在vue打包结束执行  rollup插件
    closeBundle: () => {
      let buildObj = new BuildObj();
      buildObj.buildMain();
      buildObj.preparePackageJson();
      buildObj.prepareSqlite();
      buildObj.prepareKnex();
      buildObj.buildInstaller();
    }
  };
};

//构建类
class BuildObj {
  /**
   * @desc 编译主进程
   */
  // vite build前会把dist文件夹删除 所以要重新生成mainEntry文件
  buildMain() {
    require('esbuild').buildSync({
      //入口
      entryPoints: ['./src/main/mainEntry.ts'],
      //打包
      bundle: true,
      // 压缩
      minify: true,
      //平台
      platform: 'node',
      //出口
      outfile: './dist/mainEntry.js',
      //
      external: ['electron']
    });
  }

  /**
   * @desc 生成新的package供electron-builder使用
   */
  preparePackageJson() {
    // 获取package.json路径
    let pkgJsonPath = path.resolve(process.cwd(), 'package.json');

    // 读取内容
    let localPkgJson = JSON.parse(fs.readFileSync(pkgJsonPath, 'utf-8'));

    // 修改electron版本 取消掉^  存在bug
    let electronConfig = localPkgJson.devDependencies.electron.replace(/\^| ~ /, '');

    // 添加主入口
    localPkgJson.main = 'mainEntry.js';

    //添加处理的生产依赖
    localPkgJson.dependencies['better-sqlite3'] = '*';
    localPkgJson.dependencies['bindings'] = '*';
    localPkgJson.dependencies['knex'] = '*';

    // 删除脚本 除electron之外开发依赖
    /**
     * @desc 生产依赖builder会帮你处理
     */
    delete localPkgJson.scripts;
    delete localPkgJson.devDependencies;
    localPkgJson.devDependencies = { electron: electronConfig };

    //生成electron package.json node_modules
    let targetJsonPath = path.resolve(process.cwd(), 'dist', 'package.json');
    fs.writeFileSync(targetJsonPath, JSON.stringify(localPkgJson));
    fs.mkdirSync(path.resolve(process.cwd(), 'dist', 'node_modules'));
  }

  /**
   * @desc 处理better-sqlite3
   */
  async prepareSqlite() {
    //拷贝better-sqlite3
    let srcDir = path.join(process.cwd(), 'node_modules/better-sqlite3');
    let destDir = path.join(process.cwd(), 'dist/node_modules/better-sqlite3');

    //不存在的路径会直接创建
    fs.ensureDirSync(destDir);
    //拷贝文件
    fs.copySync(srcDir, destDir, {
      filter: (src, dest) => {
        // console.log('all', src);
        // 筛选需要拷贝的文件返回true
        // 1. 精准复制build的node出来
        if (src.endsWith('better-sqlite3') || src.endsWith('build') || src.endsWith('Release') || src.endsWith('better_sqlite3.node')) {
          console.log('复制的', src);
          return true;
        } else if (src.includes(path.join(process.cwd(), 'node_modules/better-sqlite3/lib'))) {
          // 把lib文件夹全部复制出来
          console.log('lib', src);
          return true;
        }
        // 其他文件不复制
        console.log('没复制的', src);
        return false;
      }
    });

    // 制作better-sqlite3的package.json
    let pkgJson = `{"name": "better-sqlite3","main": "lib/index.js"}`;
    let pkgJsonPath = path.join(process.cwd(), 'dist/node_modules/better-sqlite3/package.json');
    fs.writeFileSync(pkgJsonPath, pkgJson);

    // 添加better-sqlite3 依赖的bindings
    // bindings 指明原声better-sqlite3.node的位置

    let bindingsContent = `module.exports = () => {
      let addonPath = require("path").join(__dirname, '../better-sqlite3/build/Release/better_sqlite3.node');
      return require(addonPath);
      };`;
    let bindingsPath = path.join(process.cwd(), 'dist/node_modules/bindings/index.js');
    fs.ensureFileSync(bindingsPath);
    fs.writeFileSync(bindingsPath, bindingsContent);

    pkgJson = `{"name": "bindings","main": "index.js"}`;
    pkgJsonPath = path.join(process.cwd(), 'dist/node_modules/bindings/package.json');
    fs.writeFileSync(pkgJsonPath, pkgJson);
  }

  /**
   * @desc 处理knex.js
   */
  prepareKnex() {
    //编译knex
    let pkgJsonPath = path.join(process.cwd(), 'dist/node_modules/knex');
    fs.ensureDirSync(pkgJsonPath);

    require('esbuild').buildSync({
      entryPoints: ['./node_modules/knex/knex.js'],
      bundle: true,
      platform: 'node',
      format: 'cjs',
      minify: true,
      outfile: './dist/node_modules/knex/index.js',
      external: ['oracledb', 'pg-query-stream', 'pg', 'sqlite3', 'tedious', 'mysql', 'mysql2', 'better-sqlite3']
    });

    // 设置 package.json
    pkgJsonPath = path.join(process.cwd(), 'dist/node_modules/knex/package.json');
    let pkgJson = `{"name": "bindings","main": "index.js"}`;
    fs.writeFileSync(pkgJsonPath, pkgJson);
  }

  /**
   * @desc electron-builder 打包
   */
  buildInstaller() {
    let options = {
      config: {
        directories: {
          // 生成文件位置
          output: path.resolve(process.cwd(), 'release'),
          // 入口
          app: path.resolve(process.cwd(), 'dist')
        },
        // 除了dependecies外需要的文件  入口应该也不用写
        files: ['**'],
        extends: null,
        productName: 'electron-vite',
        appId: 'com.juzishu.desktop',
        asar: true,
        extraResources: [
          { from: `./src/common/db.db`, to: `./` },
          { from: `./src/naive/build/Release/naive.node`, to: './' }
        ],
        nsis: {
          // 一键安装
          oneClick: true,
          //为机器安装 还是为用户安装
          perMachine: true,
          //是否允许更改安装路径
          allowToChangeInstallationDirectory: false,
          // 桌面快捷方式
          createDesktopShortcut: true,
          // 图标名称
          shortcutName: 'juzishuDesktop'
        },
        //生成yml 为更新用
        publish: [{ provider: 'generic', url: 'http://localhost:5500/' }]
      },
      // 项目地址
      project: process.cwd()
    };

    return require('electron-builder').build(options);
  }
}
