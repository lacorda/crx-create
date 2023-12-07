import initReloadClient from '../initReloadClient';

export default function addHmrIntoView(watchPath: string) {
  let pendingReload = false;

  console.log('🍄  addHmrIntoView>>> watchPath', watchPath);

  initReloadClient({
    watchPath,
    onUpdate: () => {
      // disable reload when tab is hidden
      if (document.hidden) {
        pendingReload = true;
        return;
      }
      reload();
    },
  });

  // reload
  function reload(): void {
    pendingReload = false;
    window.location.reload();
  }

  // reload when tab is visible
  function reloadWhenTabIsVisible(): void {
    console.log('🍄  visibilitychange ', document.hidden);

    !document.hidden && pendingReload && reload();
  }
  document.addEventListener('visibilitychange', reloadWhenTabIsVisible);
}
