// https://developer.chrome.com/docs/extensions/reference/api/tabs?hl=zh-cn#method-sendMessage

// 获取当前标签页
export const getCurrentTab = () => {
  return new Promise((resolve, reject) => {
    const queryOptions = { active: true, currentWindow: true };
    if (!chrome.tabs) {
      return resolve(null);
    }
    chrome.tabs.query(queryOptions, (tabs) => {
      if (!tabs || !tabs.length) {
        return resolve(null);
      }

      if (chrome.runtime.lastError) {
        return reject(null);
      }
      return resolve(tabs[0]);
    });
  });
}

// 获取指定标签页
export const getTab = (tabId: number) => {
  return chrome.tabs.get(tabId);
}

// 向content发送信息
export const sendMessageContent = async (message: any) => {
  console.log('🍄  sendMessageContent 1');
  const tab = await getCurrentTab() as chrome.tabs.Tab;
  if (!tab) {
    return;
  }

  setTimeout(() => {
    chrome.tabs.sendMessage(tab.id, message);
  }, 300)
}