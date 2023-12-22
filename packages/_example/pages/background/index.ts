import reloadOnUpdate from 'virtual:reload-on-update-in-background-script';
import 'webextension-polyfill';

reloadOnUpdate('pages/background');

// 使用 content script 的 css 时，需要重新加载扩展，因为浏览器会自动缓存 css
reloadOnUpdate('pages/content/style.scss');

console.log('background loaded');

import './event';
import './action';
