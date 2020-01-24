// @flow
import { type NextLinkType } from '@weco/common/model/next-link-type';
import {
  type WorksParams,
  type WorkParams,
  type ItemParams,
} from './url-params';
import { removeEmptyProps } from '../../utils/json';

export type DownloadUrlProps = {|
  workId: string,
  sierraId: ?string,
|};

export function workUrl({ id, ...searchParams }: WorkParams): NextLinkType {
  return {
    href: {
      pathname: `/work`,
      query: removeEmptyProps({
        id,
        searchParams,
      }),
    },
    as: {
      pathname: `/works/${id}`,
    },
  };
}

export function worksUrl(searchParams: WorksParams): NextLinkType {
  return {
    href: {
      pathname: `/works`,
      query: searchParams,
    },
    as: {
      pathname: `/works`,
      query: searchParams,
    },
  };
}

export function imagesUrl(searchParams: WorksParams): NextLinkType {
  return {
    href: {
      pathname: `/images`,
      query: removeEmptyProps({
        searchParams,
      }),
    },
    as: {
      pathname: `/images`,
      query: removeEmptyProps({
        searchParams,
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
}: ItemParams): NextLinkType {
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
          ...{ ...searchParams, page: 1 },
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
