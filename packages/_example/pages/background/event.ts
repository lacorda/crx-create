import MessageStorage from '@common/storages/messageStorage';
import { sendMessageContent } from '@common/utils/chrome';

// 监听安装事件
chrome.runtime.onInstalled.addListener(async (details) => {
  console.log('🍄  background: >>>>>>>>>>>>>>>>>> 监听安装事件', Date.now(), details);
  if (details.reason === 'install') {
    await MessageStorage.setProperty({
      install: {
        from: 'background'
      }
    });

    // 安装完成后打开新页面
    // chrome.tabs.create({
    //   url: path
    // });
  }
});

// 接收来自插件内部的消息
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  console.log('🍄  background: >>>>>>>>>>>>>>>>>> 接收来自插件内部的消息', Date.now(), message, sender, sendResponse);
});

// 接收来自网页的消息
// FIXME: onMessageExternal只能在background中使用
// FIXME: 当用onMessageExternal时，页面必须使用chrome.runtime.sendMessage(ExtensionID), 而使用压缩包模式安装，不同电脑上ExtensionID不同，所以这里不使用onMessageExternal
chrome.runtime.onMessageExternal.addListener((message, sender, sendResponse) => {
  console.log('🍄  background: >>>>>>>>>>>>>>>>>> 接收来自网页的消息', Date.now(), message, sender, sendResponse);

  // FIXME: Uncaught (in promise) Error: Could not establish connection. Receiving end does not exist.
  // chrome.runtime.sendMessage(message);
  // setTimeout(() => {
  //   chrome.runtime.sendMessage(message);
  // }, 1000);


  // background内使用chrome.tabs.sendMessage向content发送消息
  // background是一直存在的，此时可能content未加载完成，所以需要延迟发送消息
  setTimeout(() => {
    sendMessageContent(message);
  }, 300);
});

// 建立长连接时触发（content, background, popup插件内的通讯）
chrome.runtime.onConnect.addListener(function (port) {
  console.log('🍄  background: >>>>>>>>>>>>>>>>>> 监听长连接建立', Date.now(), port);

  // 监听 content 发送的消息
  port.onMessage.addListener(function (msg) {
    console.log('🍄  background: >>>>>>>>>>>>>>>>>> 监听长连接的消息', Date.now(), port, msg);

    if (port.name === 'from-content') {
      if (msg.from === "content 0") {
        port.postMessage({ from: 'background 1' });
      } else if (msg.from === "content 1") {
        port.postMessage({ from: 'background 2' });
      } else if (msg.from === "content 2") {
        port.postMessage({ from: 'background 3' });
      }
    }
  });
});