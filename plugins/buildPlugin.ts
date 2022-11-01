import fs from 'fs';
import path from 'path';

export let buildPlugin = () => {
  return {
    name: 'build-plugin',
    // 结束打包回调  在vue打包结束执行  rollup插件
    closeBundle: () => {
      let buildObj = new BuildObj();
      buildObj.buildMain();
      buildObj.preparePackageJson();
      buildObj.buildInstaller();
    },
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
      external: ['electron'],
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

    // 删除脚本 除electron之外开发依赖
    delete localPkgJson.scripts;
    delete localPkgJson.devDependencies;
    localPkgJson.devDependencies = { electron: electronConfig };

    //生成electron package.json node_modules
    let targetJsonPath = path.resolve(process.cwd(), 'dist', 'package.json');
    fs.writeFileSync(targetJsonPath, JSON.stringify(localPkgJson));
    fs.mkdirSync(path.resolve(process.cwd(), 'dist', 'node_modules'));
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
          app: path.resolve(process.cwd(), 'dist'),
        },
        // 除了dependecies外需要的文件  入口应该也不用写
        files: ['**'],
        extends: null,
        productName: 'electron-vite',
        appId: 'com.juzishu.desktop',
        asar: true,
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
          shortcutName: 'juzishuDesktop',
        },
        //生成yml 为更新用
        publish: [{ provider: 'generic', url: 'http://localhost:5500/' }],
      },
      // 项目地址
      project: process.cwd(),
    };

    return require('electron-builder').build(options);
  }
}
