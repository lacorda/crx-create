
import axios from "axios";
import { toast } from "@common/utils/tools";
import { selectAsyncStorage } from "../../utils/storage";

let storageTemp: any;

selectAsyncStorage.get().then((res) => {
  storageTemp = res;
});

const fetchTemp = async (data: Record<string, any>) => {
  if (!data) return;

  for (const [key, value] of Object.entries(data)) {
    if (value.initFetchKey) {
      const { method, data, url } = value.wprops.initFetch;

      let params = {};
      if (method === "get" || method === "GET") {
        params = data;
        delete value.wprops.initFetch.data;
      }

      if (!storageTemp[value.initFetchKey]?.fetched) {
        storageTemp[value.initFetchKey] = storageTemp[value.initFetchKey] || {};
        storageTemp[value.initFetchKey].fetched = true;

        const res = await axios({
          method,
          data,
          url,
          params,
        });
        const options = Object.values(res.data?.content || {})[0];
        storageTemp[value.initFetchKey].options = options;
      }
    } else if (
      Object.prototype.toString.call(value) === "[object Object]" &&
      !value.widget
    ) {
      await fetchTemp(value);
    }
  }
};

const withStorage = () => {
  const map = {};
  for (const [key, value] of Object.entries(storageTemp)) {
    map[key] = value.options;
  }

  console.log('🍄  map', map);

  selectAsyncStorage.set({
    ...storageTemp,
    ...map,
  });

  setTimeout(() => {
    selectAsyncStorage.get().then((res) => {
      console.log('🍄  selectAsyncStorage', res);
    })
  }, 1000);
}

const addListener = () => {
  let pageData;

  chrome.runtime.onMessage.addListener(async (message) => {
    console.log('🍄  content: >>>>>>>>>>>>>>>>>> 接收 并 发送消息', Date.now(), message);

    const { type, data } = message;;

    if (type === 'iybSKy-to-crx') {
      pageData = data;
      await fetchTemp(pageData);
      withStorage();

      chrome.runtime.sendMessage({
        type: 'iybSkyData',
        data
      });
    }

    if (type === 'popup-to-content') {
      if (data.action === 'open') {
        chrome.runtime.sendMessage({
          type: 'iybSkyData',
          data: pageData
        });
      }

      if (data.action === 'random') {
        // content -> 网页 发送消息，只能使用window.postMessage
        window.postMessage({ type: "crx-to-iybSKy", data: data.data }, "*");
      }
    }
  })
}

addListener();