import {Map} from 'immutable';
import youtubeEmbedUrl from './youtube-embed-url';
import {getImageSizesFor} from './image-sizes';
import gridClasses from './grid-classes';
import componentClasses from './component-classes';
import concat from './concat';
import contains from './contains';
import getCacheBustFile from './get-cache-bust-file';
import formatDate from './format-date';

export default Map({
  youtubeEmbedUrl,
  getImageSizesFor,
  gridClasses,
  concat,
  contains,
  componentClasses,
  getCacheBustFile,
  formatDate
});
