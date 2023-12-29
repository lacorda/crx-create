import refreshOnUpdate from "virtual:reload-on-update-in-view";

refreshOnUpdate("offscreen/clipboard");

console.log('🍄  clipboard');

const textEl: HTMLInputElement = document.querySelector('#text');

chrome.runtime.onMessage.addListener((message) => {
  const { type, target, data } = message;
  if (target === 'offscreen' && type === 'clipboard') {
    textEl.value = data;
    textEl.select();
    document.execCommand('copy');
  }
})
