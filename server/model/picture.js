import {Record} from 'immutable';

export const Picture = Record({
  fileType: 'image',
  contentUrl: null,
  caption: null,
  author: null,
  width: 0,
  height: 0,
  copyrightHolder: null,
  fileFormat: null,
  url: null
});
