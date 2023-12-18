import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import copy from 'rollup-plugin-copy';
import path, { resolve } from 'path';
import makeManifest from './utils/plugins/manifest/make-manifest';
import customDynamicImport from './utils/plugins/custom-dynamic-import';
import addHmr from './utils/plugins/add-hmr';
import watchRebuild from './utils/plugins/watch-rebuild';
import { generateKey } from './utils/tools'
import { INPUT_FILES } from './utils/constants';
import projectConfig from './project.config';

const projectName = process.env.__PROJECT_NAME__ || "_example";
const inputFiles = projectConfig[projectName].includesFiles || INPUT_FILES;

const rootDir = resolve(__dirname);
const outDir = resolve(rootDir, "dist");
const outProjectDir = resolve(outDir, "packages", projectName);

const commonDir = resolve(rootDir, "common");
const packageDir = resolve(rootDir, "packages");
const projectDir = resolve(packageDir, projectName);

const pagesDir = resolve(projectDir, "pages");
// 静态资源目录
const publicDir = resolve(projectDir, "public");

// 环境变量
const isDev = process.env.__DEV__ === 'true';
const isProduction = !isDev;

// background HMR支持
const enableHmrInBackgroundScript = true;

// 缓存失效的KEY
const cacheInvalidationKeyRef = { current: generateKey() };
function getCacheInvalidationKey() {
  return cacheInvalidationKeyRef.current;
}
function regenerateCacheInvalidationKey() {
  cacheInvalidationKeyRef.current = generateKey();
  return cacheInvalidationKeyRef;
}

export default defineConfig({
  // 基础路径重写
  experimental: {
    renderBuiltUrl(filename: string) {
      const name = filename.replace(`packages/${projectName}`, "");
      return name;
    },
  },
  resolve: {
    alias: {
      "@root": rootDir,
      "@common": commonDir,
      "@packages": packageDir,
    },
  },
  build: {
    outDir,
    minify: isProduction,
    modulePreload: false,
    reportCompressedSize: isProduction,
    // emptyOutDir: !isDev,
    rollupOptions: {
      input: (() => {
        const map = {};
        inputFiles.forEach((key) => {
          switch (key) {
            case 'content':
            case 'background':
              map[key] = resolve(pagesDir, key, 'index.ts');
              break;
            case 'contentStyle':
              map[key] = resolve(pagesDir, 'content', 'style.scss');
              break;
            default:
              map[key] = resolve(pagesDir, key, 'index.html');
              break;
          }
        })
        return map;
      })(),
      output: {
        entryFileNames: `packages/${projectName}/pages/[name]/index.js`,
        chunkFileNames: isDev ? `packages/${projectName}/assets/js/[name].js` : `packages/${projectName}/assets/js/[name].[hash].js`,
        assetFileNames: assetInfo => {
          const { name } = path.parse(assetInfo.name);
          const assetFileName = name === 'contentStyle' ? `${name}${getCacheInvalidationKey()}` : name;
          return `packages/${projectName}/assets/[ext]/${assetFileName}.chunk.[ext]`;
        },
      },
    },
  },
  plugins: [
    // manifest.json编译
    makeManifest({
      getCacheInvalidationKey,
      projectName,
    }),
    //  copy static files
    copy({
      targets: [
        { src: `${publicDir}/**/*`, dest: outProjectDir }
      ],
      hook: 'writeBundle'
    }),
    // react jsx支持
    react(),
    // 动态import语法转换
    customDynamicImport(),
    // HMR热加载
    addHmr({ background: enableHmrInBackgroundScript, view: true }),
    isDev && watchRebuild({ afterWriteBundle: regenerateCacheInvalidationKey }),
  ],
  define: {
    __DEV__: isDev,
    __PROJECT_NAME__: JSON.stringify(projectName),
  },
})
