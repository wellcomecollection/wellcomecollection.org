import cssFiles from '../config/css-assets.json';
import jsFiles from '../config/js-assets.json';

export default function getCacheBustFile(fileName) {
  const allFiles = Object.assign(cssFiles, jsFiles);
  return allFiles[fileName];
}
