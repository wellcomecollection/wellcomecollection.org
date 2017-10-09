// @flow
/* eslint-disable */
import type {Person} from '../model/person';
import type {Picture} from '../model/picture';
import {List} from 'immutable';

export type HTMLString = string;
type ContentBlockType = 'events' | 'webcomics' | 'articles' | 'exhibitions' | 'image-lists'

type ContentBlock = {|
  blockType: ContentBlockType,
  id: string,
|}

type ContributorRole = {|
  title: string;
|}

export type Contributor = {|
  role: ContributorRole;
  person: Person;
|}

export type ImagePromo = {|
  caption: string;
  image: Picture;
|}

type SeriesColour = 'turquoise' | 'red' | 'orange' | 'purple'

type Series = {
  name: string,
  description: string,
  colour: SeriesColour,
}

export type DateRange = {|
  start: Date,
  end: Date,
|}

export type Exhibition = {| ...ContentBlock, ...{|
  title: string,
  start: DateRange,
  end: DateRange,
  accessStatements: any,
  standfirst: ?string,
  featuredImages: Array<Picture>,
  description: ?string,
  galleryLevel: ?number
|}|}

export type ImageList = {| ...ContentBlock, ...{|
  description: ?string,
  items: List<{
    title: string,
    subtitle: ?string,
    image: Picture,
    caption: ?string,
    description: string,
  }>
|}|}
