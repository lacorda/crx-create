import * as fs from 'fs';
import * as path from 'path';
import type { PluginOption } from 'vite';
import url from 'url';
import * as process from 'process';
import _merge from 'lodash.merge';
import colorLog from '../../log';
import ManifestParser from './manifest-parser';
import makeManifestPages from './make-pages';
import projectConfig from "../../../project.config";

const { resolve } = path;

const rootDir = resolve(__dirname, '..', '..', '..');
const manifestFile = resolve(rootDir, 'manifest.js');
const packagesDir = resolve(rootDir, "dist", "packages");

const getManifestWithCacheBurst = (): Promise<{ default: chrome.runtime.ManifestV3 }> => {
  const withCacheBurst = (path: string) => `${path}?${Date.now().toString()}`;
  /**
   * In Windows, import() doesn't work without file:// protocol.
   * So, we need to convert path to file:// protocol. (url.pathToFileURL)
   */
  if (process.platform === 'win32') {
    return import(withCacheBurst(url.pathToFileURL(manifestFile).href));
  }
  return import(withCacheBurst(manifestFile));
};

export default function makeManifest(config?: { getCacheInvalidationKey?: () => string, projectName: string }): PluginOption {
  function makeManifest(manifest: chrome.runtime.ManifestV3, name: string, cacheKey?: string) {
    const to = resolve(packagesDir, name);

    if (!fs.existsSync(to)) {
      fs.mkdirSync(to);
    }
    const manifestPath = resolve(to, 'manifest.json');

    if (projectConfig[name]) {
      manifest = _merge(manifest, projectConfig[name]);
      manifest = makeManifestPages(projectConfig[name], manifest);
    }

    if (cacheKey) {
      manifest.content_scripts?.forEach(script => {
        // content_scripts中的css文件名中的<KEY>会被替换成hash
        script.css &&= script.css.map(css => css.replace('<KEY>', cacheKey));
      });
    }

    fs.writeFileSync(manifestPath, ManifestParser.convertManifestToString(manifest));

    colorLog(`Manifest file copy complete: ${manifestPath}`, 'success');
  }

  const { getCacheInvalidationKey, projectName } = config;

  return {
    name: 'make-manifest',
    buildStart() {
      this.addWatchFile(manifestFile);
    },
    async writeBundle() {
      const invalidationKey = getCacheInvalidationKey?.();
      const manifest = await getManifestWithCacheBurst();
      makeManifest(manifest.default, projectName, invalidationKey);
    },
  };
}
