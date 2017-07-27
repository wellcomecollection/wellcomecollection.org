import {Map} from 'immutable';
import youtubeEmbedUrl from './youtube-embed-url';
import {getImageSizesFor} from './image-sizes';
import getIconForContentType from './get-icon-for-content-type';
import getPrincipleMainMedia from './get-principle-main-media';
import getCommissionedSeries from './get-commissioned-series';
import getSeriesTitle from './get-series-title';
import getViewBox from './get-viewbox';
import gridClasses from './grid-classes';
import spacingClasses from './spacing-classes';
import fontClasses from './font-classes';
import componentClasses from './component-classes';
import concat from './concat';
import contains from './contains';
import getCacheBustFile from './get-cache-bust-file';
import jsonLd from './json-ld';
import {formatDate, formatDateTime, formatDateWithComingSoon} from './format-date';
import {isFlagEnabled} from '../util/flag-status';
import {objectAssign} from './object-assign';
import {arrayFromObject} from './array-from-object';
import {groupBodyParts} from './group-body-parts';
import {isString} from './is-string';
import {createLinkObject, getLinkObjects} from './get-link-objects';
import {prettyDump} from './pretty-dump';

export default Map({
  youtubeEmbedUrl,
  getImageSizesFor,
  getIconForContentType,
  getPrincipleMainMedia,
  getCommissionedSeries,
  getSeriesTitle,
  getViewBox,
  gridClasses,
  spacingClasses,
  fontClasses,
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
  arrayFromObject,
  groupBodyParts,
  isString,
  createLinkObject,
  getLinkObjects,
  prettyDump
});
