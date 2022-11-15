import { autoUpdater } from 'electron-updater';
import { dialog } from 'electron';

export class Update {
  static check() {
    autoUpdater.checkForUpdates();
    autoUpdater.on('update-downloaded', async () => {
      await dialog.showMessageBox({
        message: '可以更新了哦'
      });
      //退出并更新
      autoUpdater.quitAndInstall();
    });
  }
}
