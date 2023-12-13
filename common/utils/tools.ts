import { ReactNode } from "react";
import { createRoot } from "react-dom/client";

/**
 * 生成BEM规范的className
 * @param {string} block
 * @param {string} ele
 * @param {string} modify
 * @returns string
 */
export const genBem = (block?: string, ele?: string, modify?: string) => {
  let bem = `${block}`;
  if (ele) {
    bem += `__${ele}`;
  }
  if (modify) {
    bem += `--${modify}`;
  }
  return bem;
};

// 创建dom
export const createDom = (selector: string) => {
  const $el = document.createElement('div');
  $el.id = selector;
  document.body.append($el);

  return $el;
}


// 创建shadow dom
export const createShadowDom = ($container: HTMLElement, style?: string) => {
  const rootIntoShadow = document.createElement('div');
  rootIntoShadow.id = 'shadow-root';
  const shadowRoot = $container.attachShadow({ mode: 'open' });
  shadowRoot.appendChild(rootIntoShadow);

  /** Inject styles into shadow dom */
  if (style) {
    const styleElement = document.createElement('style');
    styleElement.innerHTML = style;
    shadowRoot.appendChild(styleElement);
  }

  return rootIntoShadow;
}

// 创建app入口
export const createApp = (App: ReactNode, selector = '#app-container') => {
  const $el = document.querySelector(selector);
  if (!$el) {
    throw new Error(`Can not find ${selector}`);
  }
  const root = createRoot($el);
  root.render(App);
}
