import MessageStorage from '@common/storages/messageStorage';

// 监听 runtime.onInstalled() 事件
chrome.runtime.onInstalled.addListener(async ({ reason }) => {
  if (reason === 'install') {
    await MessageStorage.setProperty({
      install: {
        from: 'background'
      }
    });

    console.log('🍄  message storage', await MessageStorage.get());

    // 安装完成后打开新页面
    // chrome.tabs.create({
    //   url: path
    // });
  }
});

// 消息通信，保存数据
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.greeting === 'tip') {
    MessageStorage.getProperty('tip').then(sendResponse);
    return true;
  }
});

// 建立长连接时触发（content, background, popup插件内的通讯）
chrome.runtime.onConnect.addListener(function (port) {
  console.log('🍄  建立长连接', port);

  // 监听 content 发送的消息
  port.onMessage.addListener(function (msg) {
    console.log('🍄  >>>> background接收到的:', msg, port.name);
    if (port.name === 'from-content') {
      console.log('🍄  content的消息');
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