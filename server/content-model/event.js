// @flow
import {List} from 'immutable';
import type {DateRange, HTMLString, ImagePromo, Contributor} from './content-blocks';
import type {Person} from '../model/person';
import type {Picture} from '../model/picture';

export type EventFormat = {|
  title: string;
|}

export type EventProgramme = {|
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
  url: string;
|}

export type Event = {|
  id: string;
  title: ?string;
  format: ?EventFormat;
  programme: ?EventProgramme;
  dates: List<DateRange>;
  intro: ?HTMLString;
  description: ?HTMLString;
  featuredImage: ?Picture;
  featuredImages: List<Picture>;
  accessOptions: List<{
    accessOption: EventAccessOption;
    designer: Person;
  }>;
  bookingEnquiryTeam: ?EventBookingEnquiryTeam;
  bookingInformation: ?HTMLString;
  isDropIn: boolean,
  contributors: List<Contributor>;
  promo: ?ImagePromo;
|}
