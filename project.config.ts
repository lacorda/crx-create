export default {
  _example: {
    web_accessible_resources: [
      {
        resources: ['assets/js/*.js', 'assets/css/*.css', 'icon-128.png', 'icon-48.png', 'font_3748380_hs096vwpmcp.js'],
      }
    ],
    // 与网页通信
    externally_connectable: {
      matches: [
        "localhost:*/*",
        "*://localhost/*",
      ],
    },
    permissions: [
      'storage',
      'sidePanel',
      'alarms',
      'contextMenus',
      'downloads',
      'downloads.open',
      'notifications',
      'offscreen',
      'geolocation',
      'clipboardWrite',
      'tabCapture'
    ],
  },
  iybSky: {
    includesFiles: ['popup', 'content', 'background'],
    version: "0.0.1",
    name: "表单自动填充工具",
    description: "投保流程辅助工具",
    web_accessible_resources: [
      {
        resources: ['assets/js/*.js', 'assets/css/*.css', 'icon-128.png', 'icon-48.png', 'font_3748380_hs096vwpmcp.js'],
      }
    ],
    // 与网页通信
    externally_connectable: {
      matches: [
        "localhost:*/*",
        "*://localhost/*",
        "*://*.iyb.com/*",
        "*://*.baoyun18.com/*",
        "*://*.iyunbao.com/*",
        "*://*.baoinsurance.com/*",
        "*://*.zhongan.com/*",
      ],
    },
  },
};
