// https://developer.chrome.com/docs/extensions/reference/api/tabs?hl=zh-cn#method-sendMessage

// 获取当前标签页
export const getCurrentTab = () => {
  return new Promise((resolve, reject) => {
    const queryOptions = { active: true, currentWindow: true };
    if (!chrome.tabs) {
      return resolve(null);
    }
    chrome.tabs.query(queryOptions, ([tab]) => {
      if (chrome.runtime.lastError) {
        return reject(chrome.runtime.lastError);
      }
      return resolve(tab);
    });
  });
}

// 获取指定标签页
export const getTab = (tabId: number) => {
  return chrome.tabs.get(tabId);
}
