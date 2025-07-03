import {
  Body,
  ChoiceBody,
  ContentResource,
  InternationalString,
} from '@iiif/presentation-3';
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
import { controlDimensions } from '@weco/content/views/works/work/work.helpers';

export const DownloadTable = styled.table.attrs({ className: font('intr', 6) })`
  position: relative;
  height: ${controlDimensions.controlHeight}px;
  white-space: nowrap;
  margin: 0;
  width: 100%;

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

  th:first-child {
    padding-left: ${controlDimensions.controlWidth}px;
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

const DownloadItem: FunctionComponent<{
  canvas: TransformedCanvas | undefined;
  item: (ContentResource | CustomContentResource | ChoiceBody) & {
    format?: string;
  };
}> = ({ canvas, item }) => {
  // If there is a choice then we only show the first one
  const displayItem = (isChoiceBody(item) ? item.items[0] : item) as Body & {
    format?: string;
  };
  const itemLabel = getLabel(displayItem);
  const fileSize = canvas && getFileSize(canvas);
  const format = displayItem.format;

  if (typeof displayItem !== 'string') {
    return (
      <DownloadTable>
        <tbody>
          <tr>
            <td>
              <Icon
                icon={
                  format?.endsWith('jpeg') || format?.endsWith('gif')
                    ? imageFile
                    : file
                }
                matchText={true}
                sizeOverride={
                  format?.endsWith('jpeg') || format?.endsWith('gif')
                    ? undefined
                    : 'height: 15px; width: 14px;'
                }
              />
              {`${itemLabel || canvas?.label}`}
            </td>
            <td width="120" style={{ textAlign: 'right' }}>{`${
              format ? `${format.split('/').pop()}` : ''
            }`}</td>
            <td width="60">
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
        </tbody>
      </DownloadTable>
    );
  } else {
    return null;
  }
};

export default DownloadItem;
