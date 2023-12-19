import { createStorage, StorageType } from "@common/storages/base";
import { getExtensionId } from "@common/utils/chrome";

const STORAGE_PREFIX = `${getExtensionId()}-`;

export const SELECT_ASYNC_STORAGE = `${STORAGE_PREFIX}selectAsync`;
export const INSURE_STORAGE = `${STORAGE_PREFIX}insure`;

export const selectAsyncStorage = createStorage<Record<string, boolean>>(
  SELECT_ASYNC_STORAGE,
  {},
  { storageType: StorageType.Local }
);

export const insureStorage = createStorage<Record<string, boolean>>(
  INSURE_STORAGE,
  {},
  { storageType: StorageType.Local }
);
