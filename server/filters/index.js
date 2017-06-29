import {Map} from 'immutable';
import youtubeEmbedUrl from './youtube-embed-url';
import {getImageSizesFor} from './image-sizes';
import getIconForContentType from './get-icon-for-content-type';
import getPrincipleMainMedia from './get-principle-main-media';
import getCommissionedSeries from './get-commissioned-series';
import getSeriesTitle from './get-series-title';
import gridClasses from './grid-classes';
import spacingClasses from './spacing-classes';
import componentClasses from './component-classes';
import concat from './concat';
import contains from './contains';
import getCacheBustFile from './get-cache-bust-file';
import jsonLd from './json-ld';
import {formatDate, formatDateTime, formatDateWithComingSoon} from './format-date';
import {isFlagEnabled} from '../util/flag-status';
import {objectAssign} from './object-assign';
import {groupBodyParts} from './group-body-parts';

export default Map({
  youtubeEmbedUrl,
  getImageSizesFor,
  getIconForContentType,
  getPrincipleMainMedia,
  getCommissionedSeries,
  getSeriesTitle,
  gridClasses,
  spacingClasses,
  concat,
  contains,
  componentClasses,
  getCacheBustFile,
  jsonLd,
  formatDate,
  formatDateTime,
  formatDateWithComingSoon,
  isFlagEnabled,
  objectAssign,
  groupBodyParts
});
