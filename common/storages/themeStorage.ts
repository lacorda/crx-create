import { BaseStorage, createStorage, StorageType } from './base';

type Color = 'blue' | 'green';

type DarkAndLight = 'light' | 'dark';

type Theme = `${Color}-${DarkAndLight}`;


type ThemeStorage = BaseStorage<Theme> & {
  setColor: (color: Color) => void;
  toggleDarkAndLight: () => void;
};

const storage = createStorage<Theme>('theme-storage-key', 'blue-light', {
  storageType: StorageType.Local,
});

const themeStorage: ThemeStorage = {
  ...storage,
  setColor: (color: Color) => {
    const darkAndLight = ((storage.getSnapshot()?.split('-')[1] || 'light') as DarkAndLight);

    storage.set(`${color}-${darkAndLight}`);
  },
  toggleDarkAndLight: () => {
    const color = ((storage.getSnapshot()?.split('-')[0] || 'blue') as Color);
    const darkAndLight = ((storage.getSnapshot()?.split('-')[1] || 'light') as DarkAndLight);

    storage.set(`${color}-${darkAndLight === 'dark' ? 'light' : 'dark'}`);
  },
};

export default themeStorage;
