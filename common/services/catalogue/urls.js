// @flow
import { type NextLinkType } from '@weco/common/model/next-link-type';
import { type SearchParams, searchParamsSerialiser } from './search-params';
import { removeEmptyProps } from '../../utils/json';

export type WorksUrlProps = SearchParams;
export type WorkUrlProps = {|
  ...SearchParams,
  id: string,
|};

export type ItemUrlProps = {|
  workId: string,
  langCode: string,
  canvas: number,
  sierraId: ?string,
  page: ?number,
  ...SearchParams,
|};

export type DownloadUrlProps = {|
  workId: string,
  sierraId: ?string,
|};

export function worksUrl(searchParams: WorksUrlProps): NextLinkType {
  return {
    href: {
      pathname: `/works`,
      query: removeEmptyProps(searchParamsSerialiser(searchParams)),
    },
    as: {
      pathname: `/works`,
      query: removeEmptyProps(searchParamsSerialiser(searchParams)),
    },
  };
}

export function imagesUrl(searchParams: WorksUrlProps): NextLinkType {
  return {
    href: {
      pathname: `/images`,
      query: removeEmptyProps({
        ...searchParamsSerialiser(searchParams),
      }),
    },
    as: {
      pathname: `/images`,
      query: removeEmptyProps({
        ...searchParamsSerialiser(searchParams),
      }),
    },
  };
}

export function downloadUrl({
  workId,
  sierraId,
}: DownloadUrlProps): NextLinkType {
  return {
    href: {
      pathname: `/download`,
      query: {
        workId,
        ...removeEmptyProps({
          sierraId: sierraId,
        }),
      },
    },
    as: {
      pathname: `/works/${workId}/download`,
      query: removeEmptyProps({
        sierraId: sierraId,
      }),
    },
  };
}
