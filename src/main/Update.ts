import { autoUpdater } from 'electron-updater';
import { dialog } from 'electron';
import { app } from 'electron';
import fs from 'fs-extra';
import path from 'path';
import { downloadFile } from './Download';
import axios from 'axios';
import prompt from './prompt';
import Zip from 'adm-zip';

export class Update {
  //全量更新
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
  //增量更新
  static async increment() {
    // 检查更新逻辑
    //  需要接口支持  判断是否需要更新 并把文件下载下来

    // {
    //   "code": 200,
    //   "success": true,
    //   "data": {
    //     "forceUpdate": false,     //全量增量 看具体方案
    //     "fullUpdate": false,
    //     "updateUrl": "http://127.0.0.1:5500/app.asar.zip",
    //     "updateExe": "http://127.0.0.1:5500/update.exe",
    //     "restart": false,
    //     "message": "我要升级成0.0.2",
    //     "version": "0.0.2"
    //   }
    // }
    //更新只做window
    if (process.platform == 'darwin') return;
    let resourcePath = path.join(process.execPath, '../resources');

    let res = await axios.get('http://127.0.0.1:5500/index.json');
    const { updateUrl, updateExeUrl, version } = res.data.data;
    console.log(res.data);
    console.log(require('../../package.json').version);

    // 更新逻辑
    // 判断更新文件是否存在
    if (require('../../package.json').version == version) {
      console.log('already up to dated');
      return;
    }

    // 判断update.exe是否存在 不在就请求放在这 要脱离主进程独立执行
    // 判断更新文件是否存在  不在就无更新
    let updateExePath = path.join(app.getPath('userData'), 'update.exe');
    if (!fs.existsSync(updateExePath)) {
      await downloadFile(updateExeUrl, app.getPath('userData'), 'update.exe');
    }
    // 下载更新文件到resources里
    console.log(resourcePath);

    try {
      const filePath = await downloadFile(updateUrl, app.getPath('downloads'), 'update.zip');
      console.log(filePath);

      const zip = new Zip(filePath);
      zip.extractAllTo(app.getPath('downloads'), true, (err) => {
        if (err) {
          console.error(err);
          return;
        }
      });

      fs.removeSync(filePath);
    } catch (error) {
      console.log(error);
    }

    console.log('download');

    //执行update      update.exe
    //              参数 update.exe的路径

    // @echo off
    // taskkill /f /im %3             停止应用需要参数三
    // timeout /T 1 /NOBREAK
    // del /f /q /a %1\app.asar       移除asar参数一
    // move %2\update.asar %1            移动文件参数二到参数一
    //  ren %1\update.asar app.asar
    // explorer.exe %4                降权启动参数四
    if (fs.existsSync(path.join(app.getPath('downloads'), 'update.asar'))) {
      // prompt(`"${updateExePath}" "${app.getPath('downloads')}" "${resourcePath}" "Electron.exe" "${app.getPath('exe')}"`);
      prompt(`"${updateExePath}" "${resourcePath}" "${app.getPath('downloads')}" "electron-vite.exe" "${app.getPath('exe')}"`);
    }
  }
}
//  全量就不说了
//  增量实现的是 程序非管理员运行执行增量更新  如果为管理员运行可以去掉sudoPrompt
//  路径为 app.asar同级下的update目录
//  不进行启动检查的，也不退出检查，更新完直接替换重启

//  另一退出更新 可以检测退出时是否存在update下asar执行更新操作

//  如果需要启动更新的，可以修改主进程相应逻辑，进行检查是否存在update下asar 执行更新

//  需要ab测和灰度退级等 就修改相关替换保留逻辑
