export default {
  _example: {
    web_accessible_resources: [
      {
        resources: ['assets/js/*.js', 'assets/css/*.css', 'icon-128.png', 'icon-48.png', 'font_4367664_o2v0zzn4ixk.js'],
        matches: ['*://*/*'],
      }
    ],
    // 与网页通信
    externally_connectable: {
      matches: [
        "localhost:*/*",
        "*://localhost/*",
      ],
    },
  },
  iybSky: {
    name: "表单自动填充工具",
    description: "投保流程辅助工具",
    web_accessible_resources: [
      {
        resources: ['assets/js/*.js', 'assets/css/*.css', 'icon-128.png', 'icon-48.png', 'font_4367664_o2v0zzn4ixk.js'],
        matches: ['*://*/*'],
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
