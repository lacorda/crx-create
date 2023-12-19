import reloadOnUpdate from 'virtual:reload-on-update-in-background-script';
import { sendMessageContent } from '@common/utils/chrome';
import 'webextension-polyfill';

reloadOnUpdate('pages/background');

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