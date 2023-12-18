import reloadOnUpdate from 'virtual:reload-on-update-in-background-script';
import { sendMessageContent } from '@common/utils/chrome';
import 'webextension-polyfill';

reloadOnUpdate('pages/background');

chrome.runtime.onMessageExternal.addListener((message, sender, sendResponse) => {
  console.log('🍄  background: >>>>>>>>>>>>>>>>>> 接收来自网页的消息', Date.now(), message, sender, sendResponse);

  setTimeout(() => {
    sendMessageContent(message);
  }, 300);
});
