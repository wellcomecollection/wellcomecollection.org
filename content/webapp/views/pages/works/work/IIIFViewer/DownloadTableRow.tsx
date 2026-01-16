import {
  Body,
  ChoiceBody,
  ContentResource,
  InternationalString,
} from '@iiif/presentation-3';
import { FunctionComponent } from 'react';
import styled from 'styled-components';
import { LinkProps } from '@weco/common/model/link-props';

import NextLink from 'next/link';

import { file, image, audio, video, pdf } from '@weco/common/icons';
import { font } from '@weco/common/utils/classnames';
import Icon from '@weco/common/views/components/Icon';
import {
  CustomContentResource,
  TransformedCanvas,
} from '@weco/content/types/manifest';
import {
  getFileSize,
  getLabelString,
  isChoiceBody,
} from '@weco/content/utils/iiif/v3';
import { controlDimensions } from '@weco/content/views/pages/works/work/work.helpers';

export const DownloadTable = styled.table.attrs({
  className: font('sans', -2),
})`
  position: relative;
  height: ${controlDimensions.controlHeight}px;
  white-space: nowrap;
  margin: 0;
  width: 100%;
  border-collapse: collapse;

  .icon {
    position: relative;
    top: 1px;
    margin-right: 10px;
  }

  th,
  td {
    white-space: nowrap;
    text-align: left;
    overflow: hidden;
    text-overflow: ellipsis;
    padding-right: 10px;
  }

  th:nth-child(2),
  td:nth-child(2) {
    width: 120px;
  }

  th:nth-child(3),
  td:nth-child(3) {
    width: 60px;
  }

  th:last-child,
  td:last-child {
    width: 100px;
    text-align: right;
  }
`;

const getLabel = (item: Body) => {
  if (typeof item !== 'string' && 'label' in item) {
    return getLabelString(item.label as InternationalString);
  } else {
    return '';
  }
};

const getIcon = (type: string, format?: string) => {
  switch (type) {
    case 'Sound':
      return audio;
    case 'Video':
      return video;
    case 'Image':
      return image;
    case 'Text': // The Text type is used for multipe formats including pdf
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
}> = ({ canvas, item, canvasLink, isCurrent }) => {
  // If there is a choice then we only show the first one
  const displayItem = (isChoiceBody(item) ? item.items[0] : item) as Body & {
    format?: string;
  };
  const itemLabel = getLabel(displayItem);
  const fileSize = canvas && getFileSize(canvas);
  const format = displayItem.format;

  if (typeof displayItem !== 'string') {
    return (
      <tr style={isCurrent ? { backgroundColor: '#323232' } : undefined}>
        <td>
          <pre>{JSON.stringify(displayItem, null, 2)}</pre>
        </td>
        <td>
          <Icon icon={getIcon(displayItem.type, format)} matchText={true} />
          <NextLink {...canvasLink}>{`${canvas?.label || itemLabel}`}</NextLink>
        </td>
        <td width="60" className="is-hidden-s">
          {fileSize ? (
            `${fileSize}`
          ) : (
            <>
              <span aria-hidden="true">- -</span>
              <span className="visually-hidden">unknown</span>
            </>
          )}
        </td>
        <td width="100">
          <a data-gtm-trigger="download_table_link" href={displayItem.id}>
            Download
          </a>
        </td>
      </tr>
    );
  } else {
    return null;
  }
};

export default DownloadItem;
