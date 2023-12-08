import ThemeStorage from '@common/storages/themeStorage';

async function toggleTheme() {
  console.log('initial theme', await ThemeStorage.get());
  ThemeStorage.toggle();
  console.log('toggled theme', await ThemeStorage.get());
}

void toggleTheme();
