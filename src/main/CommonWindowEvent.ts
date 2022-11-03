import { ipcMain, app, BrowserWindow } from 'electron';
import { BrowerWindowOptions } from '../model/WindowConfig';

export class CommonWindowEvent {
  // 获取对应的webContent
  private static getWin(event: any) {
    return BrowserWindow.fromWebContents(event.sender);
  }

  //监听
  public static listen() {
    //最小化
    ipcMain.handle('minimizeWindow', (e) => {
      this.getWin(e)?.minimize();
    });
    //最大化
    ipcMain.handle('maximizeWindow', (e) => {
      this.getWin(e)?.maximize();
    });
    // 还原
    ipcMain.handle('unmaximizeWindow', (e) => {
      this.getWin(e)?.unmaximize();
    });
    // 关闭
    ipcMain.handle('closeWindow', (e) => {
      this.getWin(e)?.close();
    });

    //显示
    ipcMain.handle('showWindow', (e) => {
      this.getWin(e)?.show();
    });
    //隐藏
    ipcMain.handle('hideWindow', (e) => {
      this.getWin(e)?.hide();
    });
    // 变化
    ipcMain.handle('resizable', (e) => {
      return this.getWin(e)?.isResizable();
    });
    //获取路径
    ipcMain.handle('getPath', (e, name: any) => {
      return app.getPath(name);
    });
  }

  // 注册
  public static regWinEvent(win: BrowserWindow) {
    win.on('maximize', () => {
      win.webContents.send('windowMaximized');
    });
    win.on('unmaximize', () => {
      win.webContents.send('windowUnmaximized');
    });

    // 处理window.open打开窗口的配置问题
    win.webContents.setWindowOpenHandler((param) => {
      /**
       * 不想要窗口就返回  { action : 'deny'}
       * 正常  { action : 'allow' , overrideBrowserWindowOptions? : youCustomConfig }
       */

      /**
       *  open 方案
       *  只有一个线程 父子通信简单 生成速度快  窗口易于控制
       *  也因为只有一个线程 所以一崩全崩  而且会导致关闭窗口依然会占用一部分内存  同样无法优化首屏
       *  需要优化webview和BrowserView时,依然需要使用线程池方案
       */

      let config = BrowerWindowOptions.getOpenWindowOptions(JSON.parse(param.features));

      if (config?.modal === true) {
        config.parent = win;
      }

      return {
        action: 'allow',
        overrideBrowserWindowOptions: config
      };
    });
  }
}
