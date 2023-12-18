import { createRoot } from 'react-dom/client';
import App from './app';
import refreshOnUpdate from 'virtual:reload-on-update-in-view';
import { createDom } from '@common/utils/tools';

refreshOnUpdate('pages/content');

function init() {
  const $el = createDom(`crx-create-root-${__PROJECT_NAME__}`);
  createRoot($el).render(<App />);
}

init();
