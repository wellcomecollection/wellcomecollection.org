import { FunctionComponent } from 'react';
import styled from 'styled-components';
import { font } from '@weco/common/utils/classnames';
import { TransformedCanvas } from '@weco/content/types/manifest';
import { toWorksItemLink } from '@weco/content/views/components/ItemLink';
import DownloadTableRow from '@weco/content/views/pages/works/work/IIIFViewer/DownloadTableRow';
import { queryParamToArrayIndex } from '.';
import { getOriginalFiles } from '@weco/content/utils/iiif/v3';

const DownloadTableContainer = styled.div`
  overflow-y: auto;
`;

const DownloadTable = styled.table.attrs({
  className: font('sans', -2),
})`
  position: relative;
  border-collapse: collapse;
  white-space: nowrap;
  margin: 0 auto;
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
    padding: 10px;
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

type DownloadTableSectionProps = {
  canvases: TransformedCanvas[];
  workId: string;
  canvas: number;
};

const DownloadTableSection: FunctionComponent<DownloadTableSectionProps> = ({
  canvases,
  workId,
  canvas,
}) => {
  return (
    <>
      <h2 className={font('brand', 0)}>Available files</h2>
      <DownloadTableContainer>
        <DownloadTable>
          <thead>
            <tr>
              <th>File</th>
              <th className="is-hidden-s">Size</th>
              <th>Download</th>
            </tr>
          </thead>
          <tbody>
            {canvases.map((canvasItem, index) => {
              const canvasIndex = index + 1;
              const canvasLink = toWorksItemLink({
                workId,
                props: {
                  canvas: canvasIndex,
                  shouldScrollToCanvas: false,
                },
              });
              const downloads = getOriginalFiles(canvasItem);
              const currentCanvasIndex = queryParamToArrayIndex(canvas) || 0;
              return downloads.map(download => (
                <DownloadTableRow
                  key={canvasItem.id + download.id}
                  canvasLink={canvasLink}
                  canvas={canvasItem}
                  item={download}
                  isCurrent={index === currentCanvasIndex}
                />
              ));
            })}
          </tbody>
        </DownloadTable>
      </DownloadTableContainer>
    </>
  );
};

export default DownloadTableSection;
