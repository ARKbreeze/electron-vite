import { app, BrowserWindow } from 'electron';
import { CustomScheme } from './CustomScheme';
//忽略安全相关警告
process.env.ELECTRON_DISABLE_SECURITY_WARNINGS = 'true';

let mainWindow: BrowserWindow;

app.whenReady().then(() => {
  mainWindow = new BrowserWindow({
    webPreferences: {
      //node集成  渲染进程
      nodeIntegration: true,
      // 安全开关   默认开  同源  关闭可以设置allowRunningInsecureCintent
      webSecurity: false,
      // 允许https页面运行 http的东西
      allowRunningInsecureContent: true,
      //单独上下文执行electrnApi 和 preload文件
      contextIsolation: false,
      webviewTag: true,
      //内置拼写检查器
      spellcheck: false,
      // 不关闭会使得html全屏触发窗口也全屏
      disableHtmlFullscreenWindowResize: true,
    },
  });
  // 设置devtool状态   left, right, bottom, undocked, detach

  if (process.argv[2]) {
    mainWindow.webContents.openDevTools({ mode: 'undocked' });
    mainWindow.loadURL(process.argv[2]);
  } else {
    CustomScheme.registerScheme();
    mainWindow.loadURL(`app://index.html`);
  }
});
