import { BrowserWindowConstructorOptions } from 'electron';
// import path from 'path';

export class BrowserWindowOptions {
  static baseOptions: BrowserWindowConstructorOptions = {
    // 有标题跟菜单栏 宽高会计算边框和标题等高度
    // 无边框就一样
    // width: 200,
    // height: 600,
    webPreferences: {
      //node集成  渲染进程
      nodeIntegration: true,
      // 安全开关   默认开  同源  关闭可以设置allowRunningInsecureContent
      webSecurity: false,
      // 允许https页面运行 http的东西
      allowRunningInsecureContent: true,
      //单独上下文执行electronApi 和 preload文件
      contextIsolation: false,
      webviewTag: true,
      //内置拼写检查器
      spellcheck: false,
      // 不关闭会使得html全屏触发窗口也全屏
      disableHtmlFullscreenWindowResize: true
      // 18已移除的api
      // nativeWindowOpen: true
      //预加载脚本  需要的话  devPlugin 打开对preload的编译  之后抽成配置
      // preload: path.resolve(__dirname, 'preload.js'),
    },
    // vue未加载完成不显示,控制逻辑放在 vue加载完成后调用
    show: false,
    // false无边框
    frame: false
    // 是否可拖动
    // movable: false
  };

  public static getOpenWindowOptions(features: BrowserWindowConstructorOptions) {
    const options: BrowserWindowConstructorOptions = {
      ...this.baseOptions
    };
    options.show = true;

    // 根据传入的配置修改options
    for (const config in features) {
      if (config === 'webPreferences') {
        for (const webConfig in features.webPreferences) {
          if (!options.webPreferences) options.webPreferences = {};
          options.webPreferences[webConfig] = features.webPreferences[webConfig];
        }
      } else {
        options[config] = features[config];
      }
    }

    return options;
  }

  public static getMainWindowOptions() {
    return this.baseOptions;
  }
}
