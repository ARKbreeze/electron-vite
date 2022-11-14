const path = require('path');
const fs = require('fs-extra');
let naive;
if (!location.href.startsWith('http')) {
  naive = require(process.platform == 'darwin' ? path.join(process.execPath, '../../../../../Resources/naive.node') : path.join(process.execPath, '../resources/naive.node'));
} else {
  naive = require(path.join(process.cwd(), './src/naive/build/Release/naive.node'));
}

console.log('naive', naive);
export { naive as default };
