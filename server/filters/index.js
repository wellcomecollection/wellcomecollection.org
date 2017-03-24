import {Map} from 'immutable';
import youtubeEmbedUrl from './youtube-embed-url';
import {getImageSizesFor} from './image-sizes';
import getIconForContentType from './get-icon-for-content-type';
import getMainMedia from './get-main-media';
import gridClasses from './grid-classes';
import spacingClasses from './spacing-classes';
import componentClasses from './component-classes';
import concat from './concat';
import contains from './contains';
import getCacheBustFile from './get-cache-bust-file';
import jsonLd from './json-ld';
import formatDate from './format-date';
import {objectAssign} from './object-assign';

export default Map({
  youtubeEmbedUrl,
  getImageSizesFor,
  getIconForContentType,
  getMainMedia,
  gridClasses,
  spacingClasses,
  concat,
  contains,
  componentClasses,
  getCacheBustFile,
  jsonLd,
  formatDate,
  objectAssign
});
