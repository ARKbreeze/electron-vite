import { protocol } from 'electron';
import fs from 'fs';
import path from 'path';

// 注册特权协议
// 供协议使用
let schemeConfig = {
  // 标准
  standard: true,
  // 安全
  // secure : true,
  // 绕过资源内容安全
  bypassCSP: true,
  // fetchApi
  supportFetchAPI: true,
  // 跨域
  corsEnabled: true,
  // 流
  stream: true,
  // 允许注册ServerWorker
  // allowServiceWorkers: true,
};
protocol.registerSchemesAsPrivileged([
  {
    // 协议   比如 file:// a.html   就返回a.html的文件
    // 这个就 app://a.html  处理逻辑需要自己编写  这个协议目前只注册stream协议
    scheme: 'app',
    privileges: schemeConfig,
  },
]);

export class CustomScheme {
  // 根据后缀返回mime-type
  private static getMimeType(extension: string) {
    // MIME Type   数据类型 媒体类型 ..  跟 Content-type
    let mimeType = '';
    switch (extension) {
      case '.js':
        mimeType = 'text/javascript';
        break;
      case '.html':
        mimeType = 'text/html';
        break;
      case '.css':
        mimeType = 'text/css';
        break;
      case '.svg':
        mimeType = 'image/svg+xml';
        break;
      case '.json':
        mimeType = 'application/json';
        break;
      default:
        break;
    }
    return mimeType;
  }

  //注册自定义app协议
  static registerScheme() {
    protocol.registerStreamProtocol('app', (request, callback) => {
      // 获取路径   /asset/etc.js
      let pathName = new URL(request.url).pathname;
      // 获取 文件扩展名   .js
      let extension = path.extname(pathName).toLowerCase();
      if (extension === '') {
        pathName = 'index.html';
        extension = '.html';
      }

      //请求文件    转换成绝对路径
      let tarFile = path.join(__dirname, pathName);
      //返回请求文件
      callback({
        statusCode: 200,
        headers: { 'content-type': this.getMimeType(extension) },
        data: fs.createReadStream(tarFile),
      });
    });
  }
}
