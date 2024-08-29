import reloadOnUpdate from 'virtual:reload-on-update-in-background-script';
import { sendMessageContent } from '@common/utils/chrome';
// import { parseUrl } from '@common/utils/tools';
import 'webextension-polyfill';

reloadOnUpdate('pages/background');

// 改为移至popup里处理「表单功能Tab」的状态
// const SKY_HOST_REG = /^sky(-)?(test|flow|fat|uat)?\.(baoyun18|iyunbao|baoinsurance|zhongan)\.com$/;

// const SKY_PAGES = [
//   '/m/short2020/trial',
//   '/m/short2020/insure'
// ]
// const checkSkyPage = (url) => {
//   if (!url) return;

//   const { host, pathname } = parseUrl(url);
//   return (host.match(SKY_HOST_REG) || host.match('localhost:')) && SKY_PAGES.includes(pathname);
// }

// const changeTab = (tabId?: number) => {
//   console.log('🍄  changeTab tabId', tabId);
//   if (!tabId) return;

//   chrome.tabs.get(tabId).then(tab => {
//     console.log('🍄  changeTab tab', tab);
//     if (checkSkyPage(tab?.url)) {
//       chrome.action.setIcon({ path: '/icon-48.png' });
//       return;
//     }
//     chrome.action.setIcon({ path: '/icon-48--disabled.png' });
//     chrome.action.disable(tab.id);
//   })
// }

// chrome.runtime.onInstalled.addListener(async (details) => {
//   if (details.reason === 'install') {
//     chrome.action.setIcon({ path: '/icon-48--disabled.png' });
//   }
// });

// chrome.tabs.onUpdated.addListener(changeTab);
// chrome.tabs.onActivated.addListener(({ tabId }) => { changeTab(tabId) });

// FIXME: 当用onMessageExternal时，页面必须使用chrome.runtime.sendMessage(ExtensionID), 而使用压缩包模式安装，不同电脑上ExtensionID不同，所以这里不使用onMessageExternal
chrome.runtime.onMessageExternal.addListener((message, sender, sendResponse) => {
  console.log('🍄  background: >>>>>>>>>>>>>>>>>> 接收来自网页的消息', Date.now(), message, sender, sendResponse);

  setTimeout(() => {
    sendMessageContent(message);
  }, 300);
});

// 接收来自插件内部的消息
// FIXME: 当插件内存在sendMessage时，这个必须要写，否则可能会报错：Uncaught (in promise) Error: Could not establish connection. Receiving end does not exist.
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  console.log('🍄  background: >>>>>>>>>>>>>>>>>> 接收来自插件内部的消息', Date.now(), message, sender, sendResponse);
});