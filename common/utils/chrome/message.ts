import { MessageType } from './types';

// 发送消息
export const sendMessage = async (message: MessageType) => {
  const response = await chrome.runtime.sendMessage(message);
  return response;
}

// 监听消息
export const onMessage = (callback: (
  request: MessageType,
  sender: chrome.runtime.MessageSender,
  sendResponse: (response?: any) => void
) => void) => {
  chrome.runtime.onMessage.addListener(callback);
}

// 监听消息(只监听一次)
export const onMessageOnce = (callback: (
  request: MessageType,
  sender: chrome.runtime.MessageSender,
  sendResponse: (response?: any) => void
) => void) => {
  chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    callback(request, sender, sendResponse);
    return true;
  });
}