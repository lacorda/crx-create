
import { INPUT_FILES } from '../../constants';

const makeManifestPages = (config, manifest) => {
  const files = config.includesFiles?.length ? config.includesFiles : INPUT_FILES;

  if (!files.includes('popup')) {
    delete manifest.action;
  }

  if (!files.includes('content')) {
    delete manifest.content_scripts;
  } else if (!files.includes('contentStyle')) {
    manifest.content_scripts.forEach(script => {
      delete script.css;
    })
  }

  if (!files.includes('background')) {
    delete manifest.background;
  }

  if (!files.includes('devtools') || !files.includes('panel')) {
    delete manifest.devtools_page;
  }

  if (!files.includes('newtab')) {
    delete manifest.chrome_url_overrides;
  }

  if (!files.includes('options')) {
    delete manifest.options_page;
  }

  if (!files.includes('sidepanel')) {
    delete manifest.side_panel;
  }

  delete manifest.includesFiles;

  return manifest;
}

export default makeManifestPages;
