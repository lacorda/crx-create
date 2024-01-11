import packageJson from './package.json' assert { type: 'json' };

/**
 * @type {chrome.runtime.ManifestV3}
 */
const manifest = {
  manifest_version: 3,
  name: packageJson.name,
  version: packageJson.version,
  description: packageJson.description,
  icons: {
    128: 'icon-128.png',
  },
  action: {
    default_popup: 'pages/popup/index.html',
    default_icon: 'icon-48.png',
  },
  content_scripts: [
    {
      matches: ['http://*/*', 'https://*/*', '<all_urls>'],
      js: ['pages/content/index.js'],
      // KEY for cache invalidation
      css: ['assets/css/contentStyle<KEY>.chunk.css'],
    },
  ],
  background: {
    service_worker: 'pages/background/index.js',
    type: 'module',
  },
  devtools_page: 'pages/devtools/index.html',
  chrome_url_overrides: {
    newtab: 'pages/newtab/index.html',
  },
  options_page: 'pages/options/index.html',
  side_panel: {
    default_path: 'pages/sidepanel/index.html',
  },
  permissions: [
    'storage',
    'sidePanel',
    // 获取tab信息要包含url时，必须添加tabs权限
    "tabs",
    "activeTab"
  ],
  web_accessible_resources: [
    {
      resources: ['assets/js/*.js', 'assets/css/*.css', 'icon-128.png', 'icon-48.png'],
      matches: ['*://*/*'],
    },
  ],
};

export default manifest;
