import refreshOnUpdate from "virtual:reload-on-update-in-view";

refreshOnUpdate("offscreen/clipboard");

console.log('🍄  clipboard');

const textEl = document.querySelector('#text');

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  const { type, target, data } = message;
  if (target === 'offscreen' && type === 'clipboard') {
    textEl.value = data;
    textEl.select();
    document.execCommand('copy');
  }
})
