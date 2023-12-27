type BadgeOptions = {
  text: string;
  color: string;
  backgroundColor: string;
}

export const setBadge = (options: BadgeOptions) => {
  const { text, color, backgroundColor } = options;

  // 设置徽章背景颜色
  chrome.action.setBadgeBackgroundColor({
    color,
  });

  // 设置徽章文本
  chrome.action.setBadgeText({
    text,
  });

  // 设置徽章文本颜色
  chrome.action.setBadgeTextColor({
    color: backgroundColor,
  })
}

export default {
  setBadge,
}