import initReloadClient from '../initReloadClient';

export default function addHmrIntoScript(watchPath: string) {
  const reload = () => {
    chrome.runtime.reload();
  };

  console.log('🍄  addHmrIntoScript>>> watchPath', watchPath);

  initReloadClient({
    watchPath,
    onUpdate: reload,
    onForceReload: reload,
  });
}
