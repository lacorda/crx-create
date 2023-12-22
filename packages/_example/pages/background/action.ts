
// 设置徽章背景颜色
chrome.action.setBadgeBackgroundColor({
  color: '#FF0000'
}, () => {
  /* callback */
});

// 设置徽章文本
chrome.action.setBadgeText({
  text: '1'
}, () => {
  /* callback */
});

// 设置徽章文本颜色
chrome.action.setBadgeTextColor({
  color: '#ffffff'
}, () => {
  /* callback */
})