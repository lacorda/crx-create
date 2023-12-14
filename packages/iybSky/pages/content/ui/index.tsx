import { createRoot } from 'react-dom/client';
import App from './app';
import refreshOnUpdate from 'virtual:reload-on-update-in-view';
import { createDom, createShadowDom } from '@common/utils/tools';
import injectedStyle from './injected.css?inline';

refreshOnUpdate('pages/content');

function init(useShadow = false) {
  const $el = createDom(`crx-create-root-${__PROJECT_NAME__}`);

  // 使用 shadow dom时，contentStyle不生效
  // shadow dom 的 css 与页面隔离，使用 innerHTML 注入 style
  if (useShadow) {
    const $shadow = createShadowDom($el, injectedStyle);
    createRoot($shadow).render(<App />);
    return;
  }

  // 不使用 shadow dom 时，contentStyle 生效，chrome插件将样式注入到页面，但无法与页面的样式隔离
  createRoot($el).render(<App />);
}

init();
