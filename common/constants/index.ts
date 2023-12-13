import { getExtensionId } from '@common/utils/chrome';

export {
  THEME_COLOR_MAP,
} from './config';

export const THEME_STORAGE_KEY = `${getExtensionId()}_theme`;