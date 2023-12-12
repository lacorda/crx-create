/**
 * This file is injected into the page.
 */

import ThemeStorage from '@common/storages/themeStorage';

async function toggleTheme() {
  console.log('initial theme', await ThemeStorage.get());
  ThemeStorage.toggleDarkAndLight();
  console.log('toggled theme', await ThemeStorage.get());
}

void toggleTheme();
