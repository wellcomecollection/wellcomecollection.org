import NextLink from 'next/link';
import { LinkProps } from '../../../model/link-props';
import { FunctionComponent } from 'react';
import {
  toCsv,
  toMaybeString,
  toString,
  toNumber,
  toSource,
  QueryTo,
  LinkFrom,
} from '../../../utils/routes';

const imagesPropsSources = ['search/paginator', 'canonical_link'] as const;
type ImagesPropsSource = typeof imagesPropsSources[number];

export type ImagesProps = {
  query: string;
  page: number;
  locationsLicense: string[];
  color: string | undefined;
  source: ImagesPropsSource | 'unknown';
};

const emptyImagesProps: ImagesProps = {
  query: '',
  page: 1,
  locationsLicense: [],
  color: undefined,
  source: 'unknown',
};

const fromQuery: QueryTo<ImagesProps> = (params) => {
  return {
    query: toString(params.query, ''),
    page: toNumber(params.page, 1),
    locationsLicense: toCsv(params['locations.license']),
    color: toMaybeString(params.color),
    source: toSource(params.source, imagesPropsSources) || 'unknown',
  };
};

function toLink(props: ImagesProps): LinkProps {
  const pathname = '/works';
  const { source, ...propsWithoutSource } = props;

  return {
    href: {
      pathname,
      query: { ...props },
    },
    as: {
      pathname,
      query: { ...propsWithoutSource },
    },
  };
}

type Props = LinkFrom<ImagesProps>;
const ImagesLink: FunctionComponent<Props> = ({
  children,
  ...props
}: Props) => {
  return <NextLink {...toLink(props)}>{children}</NextLink>;
};

export default ImagesLink;
export { toLink, fromQuery, emptyImagesProps };
