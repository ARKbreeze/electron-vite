import { app, BrowserWindow } from 'electron';
// 自定义协议
import { CustomScheme } from './CustomScheme';
// 事件监听
import { CommonWindowEvent } from './CommonWindowEvent';
// 窗口配置
import { BrowerWindowOptions } from '../model/WindowConfig';

//忽略安全相关警告
process.env.ELECTRON_DISABLE_SECURITY_WARNINGS = 'true';

// 窗口创建时 进行win事件的注册  open方案
app.on('browser-window-created', (e, win) => {
  CommonWindowEvent.regWinEvent(win);
  console.log('open');
});

let mainWindow: BrowserWindow;

app.whenReady().then(() => {
  mainWindow = new BrowserWindow(BrowerWindowOptions.getMainWindowOptions());

  // 只给主窗口注册事件  CommonWindowEvent.regWinEvent(mainWindow);

  // 设置devtool状态   left, right, bottom, undocked, detach

  if (process.argv[2]) {
    mainWindow.webContents.openDevTools({ mode: 'undocked' });
    mainWindow.loadURL(process.argv[2]);
  } else {
    CustomScheme.registerScheme();
    mainWindow.loadURL(`app://index.html`);
  }
  CommonWindowEvent.listen();
});
