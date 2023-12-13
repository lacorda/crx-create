// 标签页相关API
export {
  getCurrentTab,
  getTab,
} from './tabs';

// 获取插件ID
export function getExtensionId() {
  return chrome.runtime.id;
}

// 根据路径获取插件URL(需要在manifest.json中配置web_accessible_resources)
export function getExtensionURL(path: string) {
  return chrome.runtime.getURL(path);
}