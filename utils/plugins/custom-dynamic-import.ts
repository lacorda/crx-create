import type { PluginOption } from 'vite';

// 动态import语法转换
export default function customDynamicImport(): PluginOption {
  return {
    name: 'custom-dynamic-import',
    renderDynamicImport({ moduleId }) {
      if (!moduleId.includes('node_modules') && process.env.__FIREFOX__) {
        return {
          left: `
          {
            const dynamicImport = (path) => import(path);
            dynamicImport(browser.runtime.getURL('./') + 
            `,
          right: ".split('../').join(''))}",
        };
      }
      return {
        left: 'import(',
        right: ')',
      };
    },
    resolveImportMeta(property) {
      // content使用import.meta.url会报错，所以这里做了处理
      if (property === 'url') {
        return 'undefined';
      }
      return null;
    }
  };
}
