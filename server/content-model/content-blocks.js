// @flow
/* eslint-disable */
import type {Person} from '../model/person';
import type {Picture} from '../model/picture';
import {List} from 'immutable';

type ContentBlockType = 'events' | 'webcomics' | 'articles' | 'exhibition'

type ContentBlock = {|
  blockType: ContentBlockType,
  id: string,
  title: string,
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
  format: ?EventFormat,
  bookingType: ?EventBookingType,
  when: List<DateRange>,
  contributors: List<Contributor>,
  promo: ?ImagePromo,
  featuredMedia: ?Picture,
|}|}

export type Exhibition = {| ...ContentBlock, ...{|
  start: DateRange,
  end: DateRange,
  accessStatements: any,
  featuredImage: Picture
|}|}
