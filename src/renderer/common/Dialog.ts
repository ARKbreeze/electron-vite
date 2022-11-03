import { BrowserViewConstructorOptions } from 'electron';
export let createDialog = (url: string, config: BrowserViewConstructorOptions): Promise<Window> => {
  return new Promise((resolve, reject) => {
    // 创建窗口
    let windowProxy = window.open(url, '_black', JSON.stringify(config));
    //挂载监听
    let readyHandler = (e: MessageEvent) => {
      //拿到数据
      let msg = e.data;

      if (msg['msgName'] === '__dialogReady') {
        window.removeEventListener('message', readyHandler);
        if (windowProxy) {
          resolve(windowProxy);
        }
      }
    };
    window.addEventListener('message', readyHandler);
  });
};

export let dialogReady = () => {
  let msg = { msgName: '__dialogReady' };
  window.opener.postMessage(msg);
};
