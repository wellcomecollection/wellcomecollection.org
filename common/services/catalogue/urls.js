// @flow
import { type NextLinkType } from '@weco/common/model/next-link-type';
import {
  type SearchParams,
  searchParamsSerialiserForUrl,
} from './search-params';
import { removeEmptyProps } from '../../utils/json';

export type WorksUrlProps = SearchParams;
export type WorkUrlProps = {| id: string, ...SearchParams |};

export type ItemUrlProps = {|
  workId: string,
  langCode: string,
  canvas: number,
  sierraId: ?string,
  page: ?number,
  isOverview?: boolean,
  ...SearchParams,
|};

export type DownloadUrlProps = {|
  workId: string,
  sierraId: ?string,
|};

export function workUrl({ id, ...searchParams }: WorkUrlProps): NextLinkType {
  return {
    href: {
      pathname: `/work`,
      query: removeEmptyProps({
        id,
        ...searchParamsSerialiserForUrl(searchParams),
      }),
    },
    as: {
      pathname: `/works/${id}`,
    },
  };
}

export function worksUrl(searchParams: WorksUrlProps): NextLinkType {
  return {
    href: {
      pathname: `/works`,
      query: removeEmptyProps({
        ...searchParamsSerialiserForUrl(searchParams, true),
      }),
    },
    as: {
      pathname: `/works`,
      query: removeEmptyProps({
        ...searchParamsSerialiserForUrl(searchParams, true),
      }),
    },
  };
}

export function itemUrl({
  workId,
  page,
  sierraId,
  langCode,
  canvas,
  isOverview,
  ...searchParams
}: ItemUrlProps): NextLinkType {
  return {
    href: {
      pathname: `/item`,
      query: {
        workId,
        ...removeEmptyProps({
          page: page && page > 1 ? page : undefined,
          canvas: canvas && canvas > 1 ? canvas : undefined,
          sierraId: sierraId,
          langCode: langCode,
          isOverview: isOverview,
          ...searchParamsSerialiserForUrl({ ...searchParams, page: 1 }),
        }),
      },
    },
    as: {
      pathname: `/works/${workId}/items`,
      query: removeEmptyProps({
        page: page && page > 1 ? page : undefined,
        canvas: canvas && canvas > 1 ? canvas : undefined,
        sierraId: sierraId,
        langCode: langCode,
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
