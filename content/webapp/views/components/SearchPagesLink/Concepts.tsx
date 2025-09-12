import NextLink from 'next/link';
import { ParsedUrlQuery } from 'querystring';
import { FunctionComponent } from 'react';

import { ConceptsLinkSource } from '@weco/common/data/segment-values';
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

function toLink(
  partialProps: Partial<ConceptsProps>,
  source: ConceptsLinkSource
): LinkProps {
  const pathname = '/search/concepts';
  const props: ConceptsProps = {
    ...emptyConceptsProps,
    ...partialProps,
  };
  const query = toQuery(props);

  return {
    href: {
      pathname,
      query: { ...query, source },
    },
    as: {
      pathname,
      query,
    },
  };
}

type Props = LinkFrom<ConceptsProps> & {
  source: ConceptsLinkSource;
};
const ConceptsLink: FunctionComponent<Props> = ({
  children,
  source,
  ...props
}: Props) => {
  return (
    <NextLink {...toLink(props, source)} legacyBehavior>
      {children}
    </NextLink>
  );
};

export default ConceptsLink;
export { toLink, toQuery, fromQuery, emptyConceptsProps };