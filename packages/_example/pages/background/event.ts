import MessageStorage from '@common/storages/messageStorage';
import { sendMessageContent } from '@common/utils/chrome';
import action from './action';
import Alarm from './alarms';

// 设置闹钟
const myAlarm = new Alarm('my-alarm', { periodInMinutes: 1 });

// 监听安装 / 更新事件
chrome.runtime.onInstalled.addListener(async (details) => {
  console.log('🍄  background: >>>>>>>>>>>>>>>>>> 监听安装事件', Date.now(), details);
  if (details.reason === 'install') {
    MessageStorage.setProperty({
      install: {
        from: 'background'
      }
    });

    // 安装完成后打开新页面
    chrome.tabs.create({
      url: 'pages/options/index.html'
    });

    // 设置徽章
    action.setBadge({
      text: '1',
      color: '#fff',
      backgroundColor: '#f00',
    });

    chrome.contextMenus.create({
      id: 'openSidePanel',
      title: 'Open side panel',
      contexts: ['all']
    });
  }

  if (details.reason === 'update') {
    console.log('🍄  extension updated');
  }
});

// 右键菜单栏选择事件
chrome.contextMenus.onClicked.addListener((info, tab) => {
  if (info.menuItemId === 'openSidePanel') {
    // 在当前页打开侧边栏
    chrome.sidePanel.open({ windowId: tab.windowId });
  }
});

chrome.downloads.onCreated.addListener((downloadItem) => {
  console.log('🍄  background: >>>>>>>>>>>>>>>>>> 监听下载事件', Date.now(), downloadItem);
});

chrome.downloads.onChanged.addListener((downloadDelta) => {
  console.log('🍄  background: >>>>>>>>>>>>>>>>>> 监听下载状态变化事件', Date.now(), downloadDelta);
});

chrome.downloads.onDeterminingFilename.addListener((downloadItem, suggest) => {
  console.log('🍄  background: >>>>>>>>>>>>>>>>>> 监听下载文件名事件', Date.now(), downloadItem, suggest);
});

chrome.downloads.onErased.addListener((downloadId) => {
  console.log('🍄  background: >>>>>>>>>>>>>>>>>> 监听下载删除事件', Date.now(), downloadId);
});

chrome.notifications.onButtonClicked.addListener((notificationId, buttonIndex) => {
  console.log('🍄  background: >>>>>>>>>>>>>>>>>> 监听通知点击事件', Date.now(), notificationId, buttonIndex);
});

chrome.notifications.onClosed.addListener((notificationId, byUser) => {
  console.log('🍄  background: >>>>>>>>>>>>>>>>>> 监听通知关闭事件', Date.now(), notificationId, byUser);
})

// 监听浏览器打开事件
chrome.runtime.onStartup.addListener(async () => {
  console.log('🍄  background: >>>>>>>>>>>>>>>>>> 监听页面打开事件', Date.now());

  myAlarm.checkAlarmState();
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