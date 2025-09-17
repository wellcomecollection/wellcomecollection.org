import NextLink from 'next/link';
import { ParsedUrlQuery } from 'querystring';
import { FunctionComponent } from 'react';

import { LinkProps } from '@weco/common/model/link-props';
import {
  decodeQuery,
  encodeQuery,
  FromCodecMap,
  LinkFrom,
  numberCodec,
  stringCodec,
} from '@weco/common/utils/routes';

const emptyConceptsProps: ConceptsProps = {
  query: '',
  page: 1,
};

const codecMap = {
  query: stringCodec,
  page: numberCodec,
};

export type ConceptsProps = FromCodecMap<typeof codecMap>;

const fromQuery: (params: ParsedUrlQuery) => ConceptsProps = params => {
  return decodeQuery<ConceptsProps>(params, codecMap);
};

const toQuery: (props: ConceptsProps) => ParsedUrlQuery = props => {
  return encodeQuery<ConceptsProps>(props, codecMap);
};

function toSearchConceptsLink(partialProps: Partial<ConceptsProps>): LinkProps {
  const pathname = '/search/concepts';
  const props: ConceptsProps = {
    ...emptyConceptsProps,
    ...partialProps,
  };
  const query = toQuery(props);

  return {
    href: {
      pathname,
      query: { ...query },
    },
  };
}

type Props = LinkFrom<ConceptsProps>;
const ConceptsLink: FunctionComponent<Props> = ({
  children,
  ...props
}: Props) => {
  return <NextLink {...toSearchConceptsLink(props)}>{children}</NextLink>;
};

export default ConceptsLink;
export { toSearchConceptsLink, toQuery, fromQuery, emptyConceptsProps };
