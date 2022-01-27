// @flow
import type { PrismicDocument } from '../services/prismic/types';
import type { Picture } from './picture';
import type { Place } from './places';
import type { GenericContentFields } from './generic-content-fields';
import type { Resource } from './resource';
import type { Season } from './seasons';

// e.g. 'Permanent'
export type ExhibitionFormat = {|
  id: string,
  title: string,
  description: ?string,
|};

export type Exhibition = {|
  ...GenericContentFields,
  shortTitle: ?string,
  type: 'exhibitions',
  format: ?ExhibitionFormat,
  start: Date,
  end: ?Date,
  isPermanent: boolean,
  statusOverride: ?string,
  accessContentOverride: ?string,
  place: ?Place,
  exhibits: {|
    exhibitType: 'exhibitions',
    item: Exhibition,
  |},
  resources: Resource[],
  relatedIds: string[],
  seasons: Season[],
  prismicDocument: PrismicDocument,
|};

export type UiExhibition = {|
  ...Exhibition,
  ...{|
    galleryLevel: number, // this should be deprecated for place
    featuredImageList: Picture[],
    exhibits: {|
      exhibitType: 'exhibitions',
      item: UiExhibition,
    |}[],
  |},
|};

// We don't use these types for exhibits above
// as it creates a `needs to be defined before use` error.
export type Exhibit = {|
  exhibitType: 'exhibitions',
  item: Exhibition,
|};

export type UiExhibit = {|
  exhibitType: 'exhibitions',
  item: UiExhibition,
|};
