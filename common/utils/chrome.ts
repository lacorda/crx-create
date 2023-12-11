// get current tab
export async function getCurrentTab() {
  const queryOptions = { active: true, currentWindow: true };
  const [tab] = await chrome.tabs.query(queryOptions);
  return tab;
}

export type MessageType = {
  type: string;
  data?: any;
};

// Pass a message to a selected tab's content script
export async function sendMessageContent(message: MessageType) {
  const tab = await getCurrentTab();
  const response = await chrome.tabs.sendMessage(tab.id, message);
  return response;
}

// Pass a message between chrome extension pages
export async function sendMessage(message: MessageType) {
  const response = await chrome.runtime.sendMessage(message);
  return response;
}

// Listen for a message between chrome extension pages
export function getMessage(key: string, cb: any) {
  chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.type === key) {
      sendResponse({ [key]: true });
      if (cb) {
        cb(request.data);
      }
    }
  });
}

// Get the extension ID
export function getExtensionId() {
  return chrome.runtime.id;
}

// Get the extension URL
export function getExtensionURL(path: string) {
  return chrome.runtime.getURL(path);
}
