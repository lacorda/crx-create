import { createRoot } from 'react-dom/client';
import Panel from './Panel';
import './index.css';
import refreshOnUpdate from 'virtual:reload-on-update-in-view';

refreshOnUpdate('pages/panel');

function init() {
  const appContainer = document.querySelector('#app-container');
  if (!appContainer) {
    throw new Error('Can not find #app-container');
  }
  const root = createRoot(appContainer);
  root.render(<Panel />);
}

init();
