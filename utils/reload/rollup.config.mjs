import typescript from '@rollup/plugin-typescript';

const plugins = [typescript()];

// ts文件编译成js文件
export default [
  {
    plugins,
    // node服务: 文件更新时，重新编译
    input: 'utils/reload/initReloadServer.ts',
    output: {
      file: 'utils/reload/initReloadServer.js',
    },
    external: ['ws', 'chokidar', 'timers'],
  },
  {
    plugins,
    // 客户端: 文件更新时，重新编译
    input: 'utils/reload/injections/script.ts',
    output: {
      file: 'utils/reload/injections/script.js',
    },
  },
  {
    plugins,
    // 客户端: 更新页面
    input: 'utils/reload/injections/view.ts',
    output: {
      file: 'utils/reload/injections/view.js',
    },
  },
];
