import { BaseStorage, createStorage } from './base';
import { MESSAGE_STORAGE_KEY } from '@common/constants'

type message = Record<string, any>;

const storage = createStorage<message>(MESSAGE_STORAGE_KEY, {});

const messageStorage: BaseStorage<message> = {
  ...storage,
};

export default messageStorage;
