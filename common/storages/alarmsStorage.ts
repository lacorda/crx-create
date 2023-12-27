import { BaseStorage, createStorage } from './base';
import { ALARMS_STORAGE_KEY } from '@common/constants'


const storage = createStorage<any>(ALARMS_STORAGE_KEY, {});

const alarmsStorage: BaseStorage<any> = {
  ...storage,
};

export default alarmsStorage;
