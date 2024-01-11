import { ReactNode } from "react";
import { createRoot } from "react-dom/client";
import qs from 'qs';

export { default as toast } from './toast';

// 深拷贝，不支持function、symbol、undefined
export const clone = (obj) => {
  const copy = {};
  if (obj === null || !(obj instanceof Object)) {
    return obj;
  } else {
    for (const p in obj) {
      copy[p] = clone(obj[p]);
    }
  }
  return copy;
}


// setTimeout as promise
export const sleep = (ms: number) => {
  return new Promise((resolve) => setTimeout(resolve, ms));
};

// 首字母大写
export function firstUpperCase(str: string) {
  const firstAlphabet = new RegExp(/( |^)[a-z]/, "g");
  return str.toLowerCase().replace(firstAlphabet, (L) => L.toUpperCase());
}

export function parseUrl(url: string) {
  const { origin, protocol, host, pathname, search } = new URL(url);
  // search包含?号，要先去除
  const query = qs.parse(search.slice(1));
  return {
    origin,
    protocol,
    host,
    pathname,
    search,
    query,
  }
}

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

// 获取纯净的url，不包含search和hash
export const getPureUrl = (url: string) => {
  const urlObj = new URL(url);
  urlObj.search = '';
  urlObj.hash = '';
  return urlObj.toString();
}

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
