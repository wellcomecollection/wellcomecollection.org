// @flow
import {List} from 'immutable';
import type {DateRange, HTMLString, ImagePromo} from './content-blocks';
import type {Person} from '../model/person';
import type {Picture} from '../model/picture';

export type EventFormat = {|
  title: string;
|}

type EventAccessOption = {|
  title: string;
  acronym: string;
|}

type EventBookingEnquiryTeam = {|
  title: string;
  email: string;
  phone: string;
|}

type EventContributorRole = 'sst-designer' | 'ad-designer'

export type Event = {|
  title: ?string;
  format: ?EventFormat;
  when: List<DateRange>;
  description: ?HTMLString;
  accessOptions: List<{
    accessOption: EventAccessOption;
    designer: Person;
  }>;
  bookingEnquiryTeam: ?EventBookingEnquiryTeam;
  bookingInformation: ?HTMLString;
  contributors: List<{
    role: EventContributorRole;
    person: Person;
  }>;
  promo: ?ImagePromo;
  featuredMedia: ?Picture;
|}
