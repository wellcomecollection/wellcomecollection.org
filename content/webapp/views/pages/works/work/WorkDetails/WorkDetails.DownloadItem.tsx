import {
  Body,
  ChoiceBody,
  ContentResource,
  InternationalString,
} from '@iiif/presentation-3';
import NextLink from 'next/link';
import { FunctionComponent } from 'react';
import styled from 'styled-components';

import { file, imageFile } from '@weco/common/icons';
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
import { toWorksItemLink } from '@weco/content/views/components/ItemLink';
import { controlDimensions } from '@weco/content/views/pages/works/work/work.helpers';

export const DownloadTable = styled.table.attrs({
  className: font('sans', -2),
})<{ $padFirstHeading?: boolean; $isActive?: boolean }>`
  border-collapse: collapse;
  position: relative;
  height: ${controlDimensions.controlHeight}px;
  white-space: nowrap;
  margin: 0;
  width: 100%;

  ${props =>
    props.$isActive &&
    `
      tr {
        background: ${props.theme.color('black')};

        &::before {
          content: '';
          position: absolute;
          top: 0;
          left: -10px;
          bottom: 0;
          width: 10px;
          background: ${props.theme.color('black')};
          border-left: 4px solid ${props.theme.color('yellow')};
        }
      }
    `}

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

  ${props =>
    props.$padFirstHeading &&
    `
    th:first-child {
      padding-left: ${controlDimensions.controlWidth}px;
    }
  `}

  th:first-child,
  td:first-child {
    max-width: 10rem;
  }

  th:nth-child(2),
  td:nth-child(2) {
    max-width: 6rem;
    text-align: right;
  }

  th:nth-child(3),
  td:nth-child(3) {
    width: 60px;
    text-align: right;
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

type DownloadItemProps = {
  canvas: TransformedCanvas | undefined;
  item: (ContentResource | CustomContentResource | ChoiceBody) & {
    format?: string;
  };
  currentCanvasIndex?: number;
} & (
  | {
      linkToCanvas: true;
      workId: string;
      canvasIndex: number;
    }
  | {
      linkToCanvas?: false;
      workId?: string;
      canvasIndex?: number;
    }
);

const DownloadItem: FunctionComponent<DownloadItemProps> = ({
  canvas,
  item,
  workId,
  canvasIndex,
  linkToCanvas = false,
  currentCanvasIndex,
}) => {
  const isActive =
    linkToCanvas &&
    canvasIndex !== undefined &&
    currentCanvasIndex === canvasIndex;

  // If there is a choice then we only show the first one
  const displayItem = (isChoiceBody(item) ? item.items[0] : item) as Body & {
    format?: string;
  };
  const itemLabel = getLabel(displayItem);
  const fileSize = canvas && getFileSize(canvas);
  const format = displayItem.format;

  const fileName = itemLabel || canvas?.label || '';
  const formatString = format ? format.split('/').pop() || '' : '';
  const canvasLink =
    linkToCanvas && workId && canvasIndex
      ? toWorksItemLink({
          workId,
          props: {
            canvas: canvasIndex,
            shouldScrollToCanvas: false,
          },
        })
      : undefined;

  const fileIcon = (
    <Icon
      icon={
        format?.endsWith('jpeg') || format?.endsWith('gif') ? imageFile : file
      }
      matchText={true}
      sizeOverride={
        format?.endsWith('jpeg') || format?.endsWith('gif')
          ? undefined
          : 'height: 15px; width: 14px;'
      }
    />
  );

  const fileNameContent = canvasLink ? (
    <NextLink
      {...canvasLink}
      style={{ display: 'inline-flex', alignItems: 'center' }}
    >
      {fileIcon}
      {fileName}
    </NextLink>
  ) : (
    <>
      {fileIcon}
      {fileName}
    </>
  );

  if (typeof displayItem !== 'string') {
    return (
      <DownloadTable $isActive={isActive}>
        <tbody>
          <tr>
            <td title={fileName}>{fileNameContent}</td>
            <td title={formatString}>{formatString}</td>
            <td>
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
              <a data-gtm-trigger="download_table_link" href={displayItem.id}>
                Download
              </a>
            </td>
          </tr>
        </tbody>
      </DownloadTable>
    );
  } else {
    return null;
  }
};

export default DownloadItem;
