import { createApp } from "@common/utils/tools";
import "./index.css";
import Popup from "./Popup";
import refreshOnUpdate from "virtual:reload-on-update-in-view";

refreshOnUpdate("pages/popup");

createApp(<Popup />);

const addListener = () => {
  // 新建长连接
  console.log('🍄  popup: >>>>>>>>>>>>>>>>>> 长连接建立', Date.now());
  const port = chrome.runtime.connect({ name: "from-popup" });

  console.log('🍄  popup: >>>>>>>>>>>>>>>>>> 长连接 发送消息', Date.now());
  port.postMessage({ from: "popup 0" });

  port.onMessage.addListener(function (msg) {
    console.log('🍄  popup: >>>>>>>>>>>>>>>>>> 长连接 接收消息', Date.now(), port, msg);

    if (msg.from === "background 1") {
      port.postMessage({ from: "popup 1" });
    } else if (msg.from === "background 2") {
      port.postMessage({ from: "popup 2" });
    }
  });

  chrome.runtime.onMessage.addListener((msg) => {
    console.log('🍄  popup: >>>>>>>>>>>>>>>>>> 接收消息', Date.now(), msg);
  })
}

addListener();