import {Map} from 'immutable';
import parseBody from './parse-body';
import youtubeEmbedUrl from './youtube-embed-url';
import {getImageSizesFor} from './image-sizes';

export default Map({
  youtubeEmbedUrl,
  getImageSizesFor,
  parseBody
});
