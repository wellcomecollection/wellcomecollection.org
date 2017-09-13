// @flow
/* eslint-disable */
import type {Person} from '../model/person';
import type {Picture} from '../model/picture';
import {List} from 'immutable';

type ContentBlockType = 'events' | 'webcomics' | 'articles' | 'exhibitions' | 'image-lists'

type ContentBlock = {|
  blockType: ContentBlockType,
  id: string,
|}

type ContributorRole = 'author' | 'photographer' | 'speaker'

type Contributor = {|
  role: ContributorRole,
  person: Person,
|}

export type ImagePromo = {|
  text: string,
  media: Picture,
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

export type EventFormat = 'workshop' | 'discussion' | 'walkingtour'
export type EventBookingType = 'dropin' | 'ticketed' | 'enquire' | 'firstcomefirstseated'

export type Event = {| ...ContentBlock, ...{|
  title: string,
  format: ?EventFormat,
  bookingType: ?EventBookingType,
  when: List<DateRange>,
  contributors: List<Contributor>,
  promo: ?ImagePromo,
  featuredMedia: ?Picture,
|}|}

export type Exhibition = {| ...ContentBlock, ...{|
  title: string,
  start: DateRange,
  end: DateRange,
  accessStatements: any,
  featuredImage: Picture,
  description: ?string,
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
