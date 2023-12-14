try {
  chrome.devtools.panels.create('Dev Tools', 'icon-48.png', 'pages/panel/index.html');
} catch (e) {
  console.error(e);
}
