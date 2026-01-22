import { Body, ChoiceBody, ContentResource } from '@iiif/presentation-3';
import { FunctionComponent } from 'react';
import { LinkProps } from '@weco/common/model/link-props';
import NextLink from 'next/link';

import { file, image, audio, video, pdf, download } from '@weco/common/icons';
import Icon from '@weco/common/views/components/Icon';
import {
  CustomContentResource,
  TransformedCanvas,
} from '@weco/content/types/manifest';
import { getFileSize, isChoiceBody } from '@weco/content/utils/iiif/v3';
import { getFileLabel } from '@weco/content/utils/works';

import { IconWrapper, InlineFlex, StyledTr } from './DownloadTable.styles';

const getIcon = (type: string, format?: string) => {
  switch (type) {
    case 'Sound':
      return audio;
    case 'Video':
      return video;
    case 'Image':
      return image;
    case 'Text': // The Text type is used for multiple formats including pdf
      return format?.endsWith('pdf') ? pdf : file;
    default:
      return file;
  }
};

const DownloadItem: FunctionComponent<{
  canvas: TransformedCanvas | undefined;
  item: (ContentResource | CustomContentResource | ChoiceBody) & {
    format?: string;
  };
  canvasLink: LinkProps;
  isCurrent?: boolean;
  index: number;
}> = ({ canvas, item, canvasLink, isCurrent, index }) => {
  // If there is a choice then we only show the first one
  const displayItem = (isChoiceBody(item) ? item.items[0] : item) as Body & {
    format?: string;
  };
  const itemLabel = getFileLabel(
    canvas?.label,
    `${typeof displayItem !== 'string' ? displayItem.type : ''} ${index}`
  );
  const fileSize = canvas && getFileSize(canvas);
  const format = displayItem.format;

  if (typeof displayItem !== 'string') {
    return (
      <StyledTr $isCurrent={isCurrent}>
        <td>
          <InlineFlex>
            <IconWrapper>
              <Icon icon={getIcon(displayItem.type, format)} />
            </IconWrapper>
            <NextLink {...canvasLink}>{itemLabel}</NextLink>
          </InlineFlex>
        </td>
        <td className="is-hidden-s">
          {fileSize ? (
            `${fileSize}`
          ) : (
            <>
              <span aria-hidden="true">- -</span>
              <span className="visually-hidden">unknown</span>
            </>
          )}
        </td>
        <td>
          <InlineFlex>
            <IconWrapper>
              <Icon icon={download} />
            </IconWrapper>
            <a data-gtm-trigger="download_table_link" href={displayItem.id}>
              Download
            </a>
          </InlineFlex>
        </td>
      </StyledTr>
    );
  } else {
    return null;
  }
};

export default DownloadItem;
