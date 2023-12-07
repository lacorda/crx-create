import { resolve } from 'path';
import { readFileSync } from 'fs';

// 以当前时间戳生成一个key，用于缓存失效
export function generateKey(): string {
  return `${Date.now().toFixed()}`;
}

// 获取injection文件代码(客户端更新)
export function getInjectionCode(fileName: string): string {
  return readFileSync(resolve(__dirname, '..', 'utils', 'reload', 'injections', fileName), { encoding: 'utf8' });
}

// 首字母大写
export function firstUpperCase(str: string) {
  const firstAlphabet = new RegExp(/( |^)[a-z]/, "g");
  return str.toLowerCase().replace(firstAlphabet, (L) => L.toUpperCase());
}