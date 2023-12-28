import { getPureUrl } from '@common/utils/tools';

export const getDocument = (url: string) => {
  return new Promise((resolve) => {
    // 获取插件内部的所有页面信息
    clients.matchAll().then((clients) => {
      const has = clients.some((client) => {
        const pureUrl = getPureUrl(client.url);
        if (pureUrl.endsWith(url)) {
          resolve(client);
          return true;
        }
        return false;
      });

      if (!has) {
        resolve(null);
      }
    })
  })
};

export const closeDocument = async (url: string) => {
  const document = await getDocument(url);
  if (document) {
    chrome.offscreen.closeDocument();
  }
}
