// @flow
import {List} from 'immutable';
import type {DateRange, HTMLString, ImagePromo, Contributor} from './content-blocks';
import type {Person} from '../model/person';

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
|}

export type Event = {|
  id: string;
  title: ?string;
  format: ?EventFormat;
  programme: ?EventProgramme;
  when: List<DateRange>;
  description: ?HTMLString;
  accessOptions: List<{
    accessOption: EventAccessOption;
    designer: Person;
  }>;
  bookingEnquiryTeam: ?EventBookingEnquiryTeam;
  bookingInformation: ?HTMLString;
  contributors: List<{
    role: Contributor;
    person: Person;
  }>;
  promo: ?ImagePromo;
|}
