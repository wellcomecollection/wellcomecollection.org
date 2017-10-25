import cssFiles from '../config/css-assets.json'; // These are generated files
// import jsFiles from '../config/js-assets.json';

export default function getCacheBustFile(fileName) {
  const allFiles = Object.assign(cssFiles);
  return allFiles[fileName];
}
