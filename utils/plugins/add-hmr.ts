
import type { PluginOption } from 'vite';
import { DUMMY_CODE, ID_IN_BACKGROUND_SCRIPT, ID_IN_VIEW } from '../constants';
import { getInjectionCode } from '../tools';
import { HMRConfig } from '../types';

const isDev = process.env.__DEV__ === 'true';

export default function addHmr(config?: HMRConfig): PluginOption {
  const { background = false, view = true } = config || {};
  const scriptHmrCode = isDev ? getInjectionCode('script.js') : DUMMY_CODE;
  const viewHmrCode = isDev ? getInjectionCode('view.js') : DUMMY_CODE;

  return {
    name: 'add-hmr',
    resolveId(id) {
      if (id === ID_IN_BACKGROUND_SCRIPT || id === ID_IN_VIEW) {
        return getResolvedId(id);
      }
    },
    load(id) {
      // hmr走reload/injection更新
      if (id === getResolvedId(ID_IN_BACKGROUND_SCRIPT)) {
        return background ? scriptHmrCode : DUMMY_CODE;
      }

      if (id === getResolvedId(ID_IN_VIEW)) {
        return view ? viewHmrCode : DUMMY_CODE;
      }
    },
  };
}

function getResolvedId(id: string) {
  return '\0' + id;
}
