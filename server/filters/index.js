import {Map} from 'immutable';
import youtubeEmbedUrl from './youtube-embed-url';
import {getImageSizesFor} from './image-sizes';
import gridClasses from './grid-classes';
import componentClasses from './component-classes';
import concat from './concat';
import contains from './contains';
import getCacheBustFile from './get-cache-bust-file';
import jsonLd from './json-ld';
import getDays from './get-days';
import getDate from './get-date';

export default Map({
  youtubeEmbedUrl,
  getImageSizesFor,
  gridClasses,
  concat,
  contains,
  componentClasses,
  getCacheBustFile,
  jsonLd,
  getDays,
  getDate
});
