// @flow
import { type NextLinkType } from '@weco/common/model/next-link-type';
import { removeEmptyProps } from '../../utils/json';

export type DownloadUrlProps = {|
  workId: string,
  sierraId: ?string,
|};

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

type Params = { [key: string]: any };
type UrlParams = { [key: string]: string };
export function serialiseUrl(params: Params): UrlParams {
  return Object.keys(params).reduce((acc, key) => {
    const val = params[key];

    // We use this function as next represents arrays in JS
    // as arrays in the URLs, unsurprisingly, and the csv
    // is our own bespoke syntax.

    // worksType = ['a', 'b', 'c']
    // next: workType=a&workType=b&workType=c
    // weco: workType=a,b,c
    if (Array.isArray(val)) {
      return {
        ...acc,
        [key]: val.join(','),
      };
    }

    // any empty values, we don't add
    if (val === null || val === undefined || val === '') {
      return acc;
    }

    // As all our services default to `page: null` to `page: 1` so we remove it
    if (key === 'page' && val === 1) {
      return acc;
    }

    return {
      ...acc,
      [key]: val.toString(),
    };
  }, {});
}
