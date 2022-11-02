import { ipcMain, BrowserView, app, BrowserWindow } from 'electron';

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
  }
}
