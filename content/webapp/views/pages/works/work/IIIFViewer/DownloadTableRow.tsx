import { Body, ChoiceBody, ContentResource } from '@iiif/presentation-3';
import NextLink from 'next/link';
import { FunctionComponent } from 'react';

import { audio, download, file, image, pdf, video } from '@weco/common/icons';
import { LinkProps } from '@weco/common/model/link-props';
import Icon from '@weco/common/views/components/Icon';
import {
  CustomContentResource,
  TransformedCanvas,
} from '@weco/content/types/manifest';
import { getFileSize, isChoiceBody } from '@weco/content/utils/iiif/v3';
import { getFileLabel } from '@weco/content/utils/works';

import { IconWrapper, StyledTr } from './DownloadTable.styles';

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

const DownloadTableRow: FunctionComponent<{
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
          <NextLink
            {...canvasLink}
            style={{ display: 'inline-flex', alignItems: 'center' }}
          >
            <IconWrapper>
              <Icon icon={getIcon(displayItem.type, format)} />
            </IconWrapper>
            {itemLabel}
          </NextLink>
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
          <a
            data-gtm-trigger="download_table_link"
            href={displayItem.id}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
            }}
          >
            <IconWrapper>
              <Icon icon={download} />
            </IconWrapper>
            Download
          </a>
        </td>
      </StyledTr>
    );
  } else {
    return null;
  }
};

export default DownloadTableRow;
