import { getExtensionId } from '@common/utils/chrome';

export {
  THEME_COLOR_MAP,
} from './config';

export const THEME_STORAGE_KEY = `${getExtensionId()}_theme`;

export const MESSAGE_STORAGE_KEY = `${getExtensionId()}_MESSAGE_STORAGE`;

export const ALARMS_STORAGE_KEY = `${getExtensionId()}_ALARMS_STORAGE`;