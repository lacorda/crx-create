/**
 * This file is injected into the page.
 */

import ThemeStorage from '@common/storages/themeStorage';

async function toggleTheme() {
  console.log('initial theme', await ThemeStorage.get());
  ThemeStorage.toggleDarkAndLight();
  console.log('toggled theme', await ThemeStorage.get());
}

void toggleTheme();

const addListener = () => {
  // 新建长连接
  console.log('🍄  content: >>>>>>>>>>>>>>>>>> 长连接建立', Date.now());
  const port = chrome.runtime.connect({ name: "from-content" });

  console.log('🍄  content: >>>>>>>>>>>>>>>>>> 长连接 发送消息', Date.now());
  port.postMessage({ from: "content 0" });

  port.onMessage.addListener((msg) => {
    console.log('🍄  content: >>>>>>>>>>>>>>>>>> 长连接 接收消息', Date.now(), port, msg);

    if (msg.from === "background 1") {
      port.postMessage({ from: "content 1" });
    } else if (msg.from === "background 2") {
      port.postMessage({ from: "content 2" });
    }
  });

  chrome.runtime.onMessage.addListener((msg) => {
    console.log('🍄  content: >>>>>>>>>>>>>>>>>> 接收 并 发送消息', Date.now(), msg);
    chrome.runtime.sendMessage(msg);
  })

  // 监听来自网页的消息，window只能在content中使用
  window.addEventListener("message", (event) => {
    if (event.source !== window) return;

    if (event.data?.data?.from === 'webpage') {
      console.log('🍄  content: >>>>>>>>>>>>>>>>>> 监听来自网页的消息', event.data);
      chrome.runtime.sendMessage(event.data);
    }
  }, false);
}

addListener();