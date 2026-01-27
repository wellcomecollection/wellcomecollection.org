import NextLink from 'next/link';
import { ParsedUrlQuery } from 'querystring';
import { FunctionComponent } from 'react';

import { LinkProps } from '@weco/common/model/link-props';
import {
  booleanCodec,
  csvCodec,
  decodeQuery,
  encodeQuery,
  FromCodecMap,
  LinkFrom,
  numberCodec,
  stringCodec,
} from '@weco/common/utils/routes';
import { splitValues } from '@weco/content/utils/filters';

export type EventsProps = FromCodecMap<typeof codecMap>;
const emptyEventsProps: EventsProps = {
  query: '',
  page: 1,
  format: [],
  audience: [],
  interpretation: [],
  location: [],
  isAvailableOnline: false,
  timespan: '',
};
const codecMap = {
  query: stringCodec,
  page: numberCodec,
  format: csvCodec,
  audience: csvCodec,
  interpretation: csvCodec,
  location: csvCodec,
  isAvailableOnline: booleanCodec,
  timespan: stringCodec,
};
const fromQuery: (params: ParsedUrlQuery) => EventsProps = params => {
  return decodeQuery<EventsProps>(params, codecMap);
};
const toQuery: (props: EventsProps) => ParsedUrlQuery = props => {
  return encodeQuery<EventsProps>(props, codecMap);
};
function toSearchEventsLink(partialProps: Partial<EventsProps>): LinkProps {
  const pathname = '/search/events';
  const props: EventsProps = {
    ...emptyEventsProps,
    ...partialProps,
  };
  const query = toQuery(props);
  return {
    href: {
      pathname,
      query,
    },
  };
}
type Props = LinkFrom<EventsProps>;
const EventsLink: FunctionComponent<Props> = ({
  children,
  ...props
}: Props) => {
  return <NextLink {...toSearchEventsLink(props)}>{children}</NextLink>;
};

// We want to exclude exhibitions when we fetch events,
// but we don't want to show the negated value in the UI.
// So we include the !exhibitions format value for the API query
// and have a separate format array for the UI.
export const getEventFormats = ({
  paramsFormat,
  excludeExhibitions = true,
}: {
  paramsFormat: string[];
  excludeExhibitions?: boolean;
}): {
  apiFormat: string[];
  uiFormat: string[];
} => {
  const format = excludeExhibitions
    ? paramsFormat.length > 0
      ? [...paramsFormat, '!exhibitions']
      : ['!exhibitions']
    : paramsFormat;

  const { all, positiveValues } = splitValues(format);
  return { apiFormat: all, uiFormat: positiveValues };
};

export default EventsLink;
export { toSearchEventsLink, toQuery, fromQuery, emptyEventsProps };
