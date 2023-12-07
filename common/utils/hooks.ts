import { genBem } from './tools';

/**
 * 返回BEM规范类名方法
 * @param prefixCls 类名
 * @returns
 */
export function useBem(prefixCls?: string) {
  return (e?: string, m?: string) => genBem(prefixCls, e, m);
}

export default {
  useBem,
};
