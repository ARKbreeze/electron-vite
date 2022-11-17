import knex, { Knex } from 'knex';
import fs from 'fs-extra';
import path from 'path';
import { ipcRenderer } from 'electron';
let dbInstance: Knex;

if (!dbInstance) {
  let dbPath;

  // 开发取本地
  if (location.href.startsWith('http')) {
    console.log('development-db');

    // console.log('cwd', process.cwd());
    // console.log('execPath', process.execPath);

    //mac  darwin
    dbPath = path.join(process.cwd(), './src/common/db.db');
    //window 可以
    // dbPath = path.join(process.execPath, '../../../../src/common/db.db');

    console.log('dbPath', dbPath);
    console.log(fs.existsSync(dbPath));
  } else {
    console.log('production-db');
    console.log(ipcRenderer.send('getPath', 'userData'));

    //生产
    // 确定db是否存在 不存在创建新的    darwin  unix系内核
    // dbPath = process.platform == 'darwin' ? path.join(process.env.HOME, '../Library/Preferences') : path.join(process.env.HOME, '/.local/share');
    // dbPath = path.join(dbPath, 'electron-vite/db.db');
    // console.log('dbPath', dbPath);

    // 判断电脑中db是否存在 不存在就复制一个过去
    // let dbIsExist = fs.existsSync(dbPath);
    // 确定

    // if (!dbIsExist) {
    //   fs.ensureFileSync(dbPath);
    //   console.log('execPath', process.execPath);
    //   console.log('cwdPath', process.cwd());
    //   // 从项目中位置复制初始数据库过去
    //   let resourceDbPath = path.join(process.execPath, '../resource/db.db');
    //   console.log(' res', resourceDbPath);

    //   fs.copyFileSync(resourceDbPath, dbPath);
    // }

    dbPath = process.platform == 'darwin' ? path.join(process.execPath, '../../../../../Resources/db.db') : path.join(process.execPath, '../resources/db.db');
    // darwin 的resource路径
    console.log(fs.existsSync(dbPath), dbPath);
  }
  // 进行数据库链接
  // debugger;
  dbInstance = knex({
    client: 'better-sqlite3',
    connection: { filename: dbPath },
    useNullAsDefault: true
  });
}
// 把db 按需导出
export let db = dbInstance;
