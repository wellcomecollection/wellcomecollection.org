// @flow
import {List} from 'immutable';

type ContentBlock = {|
  id: string,
  title: string,
  type: ContentBlockType,
|}

type ContributorRole = 'author' | 'photographer' | 'speaker'

type Contributor = {|
  role: ContributorRole,
  person: Person,
|}

type Promo = {|
  text: string,
  media: Picture | Video,
|}

type SeriesColour = 'turquoise' | 'red' | 'orange' | 'purple'

type Series = {
  name: string,
  description: string,
  colour: SeriesColour,
}

type DateRange = {|
  start: Date,
  end: Date,
|}

type EventFormat = 'workshop' | 'discussion' | 'walkingtour'
type EventBookingType = 'dropin' | 'ticketed' | 'enquire' | 'firstcomefirstseated'

type Event = {| ...ContentBlock, ...{|
  format: EventFormat,
  bookingType: EventBookingType,
  when: List<DateRange>,
  contributors: List<Contributor>,
  promo: List<Promo>,
|}|}
