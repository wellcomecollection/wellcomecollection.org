import {Map} from 'immutable';
import youtubeEmbedUrl from './youtube-embed-url';
import {getImageSizesFor} from './image-sizes';
import gridClasses from './grid-classes';
import componentClasses from './component-classes';
import concat from './concat';
import getCacheBustFile from './get-cache-bust-file';

export default Map({
  youtubeEmbedUrl,
  getImageSizesFor,
  gridClasses,
  componentClasses,
  concat,
  getCacheBustFile
});
