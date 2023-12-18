import { createStorage, StorageType } from "@common/storages/base";
import { getExtensionId } from "@common/utils/chrome";

const STORAGE_PREFIX = `${getExtensionId()}-`;

export const SELECT_ASYNC_STORAGE = `${STORAGE_PREFIX}selectAsync`;
export const SELECT_ASYNC_STATUS_STORAGE = `${STORAGE_PREFIX}selectAsyncStatus`;

export const selectAsyncStorage = createStorage<Record<string, boolean>>(
  SELECT_ASYNC_STORAGE,
  {},
  { storageType: StorageType.Local }
);
