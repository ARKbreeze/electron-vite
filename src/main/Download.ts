import Axios from 'axios';
import fs from 'fs-extra';
import path from 'path';

/**
 * @desc 删除文件
 * @param targetPath 删除路径
 */
function removeFile(targetPath) {
  try {
    fs.removeSync(targetPath);
  } catch (error) {
    console.log(error);
  }
}

/**
 *
 * @param  url         请求地址
 * @param  targetPath  文件路径
 * @param  name        文件名称
 * @returns
 */
export async function downloadFile(url, targetPath, fileName) {
  if (!fs.existsSync(targetPath)) {
    fs.ensureDirSync(targetPath);
  }

  let filePath = path.join(targetPath, fileName);
  let writer = fs.createWriteStream(filePath);
  let res = await Axios({
    method: 'GET',
    url,
    responseType: 'stream'
  });

  res.data.pipe(writer);

  return new Promise((resolve, reject) => {
    writer.on('finish', resolve);
    writer.on('error', () => {
      removeFile(filePath);
      reject();
    });
  });
}
