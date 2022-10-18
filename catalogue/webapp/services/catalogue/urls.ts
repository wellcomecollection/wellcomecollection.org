import { NextLinkType } from '@weco/common/model/next-link-type';
import { removeEmptyProps } from '@weco/common/utils/json';

export type DownloadUrlProps = {
  workId: string;
  sierraId?: string;
};

export function downloadUrl({
  workId,
  sierraId,
}: DownloadUrlProps): NextLinkType {
  return {
    href: {
      pathname: '/download',
      query: {
        workId,
        ...removeEmptyProps({ sierraId }),
      },
    },
    as: {
      pathname: `/works/${workId}/download`,
      query: removeEmptyProps({ sierraId }),
    },
  };
}
