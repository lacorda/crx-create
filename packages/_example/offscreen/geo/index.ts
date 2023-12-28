import { clone } from '@common/utils/tools';
import refreshOnUpdate from "virtual:reload-on-update-in-view";

refreshOnUpdate("offscreen/geo");

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  const { type, target } = message;
  if (target === 'offscreen' && type === 'geo') {
    navigator.geolocation.getCurrentPosition((res) => {
      sendResponse(clone(res));
    })
  }

  return true;
})
