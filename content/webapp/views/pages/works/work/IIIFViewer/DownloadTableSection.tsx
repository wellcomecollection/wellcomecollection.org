import { FunctionComponent } from 'react';

import { font } from '@weco/common/utils/classnames';
import { TransformedCanvas } from '@weco/content/types/manifest';
import { getOriginalFiles } from '@weco/content/utils/iiif/v3';
import { toWorksItemLink } from '@weco/content/views/components/ItemLink';
import DownloadTableRow from '@weco/content/views/pages/works/work/IIIFViewer/DownloadTableRow';

import { queryParamToArrayIndex } from '.';
import { DownloadTable } from './DownloadTable.styles';

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
    <DownloadTable>
      <thead>
        <tr className={font('sans-bold', -1)}>
          <th>File</th>
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
          const currentCanvasIndex =
            typeof canvas === 'number' && canvas > 0
              ? queryParamToArrayIndex(canvas)
              : -1;
          return downloads.map(download => (
            <DownloadTableRow
              key={canvasItem.id + download.id}
              canvasLink={canvasLink}
              canvas={canvasItem}
              item={download}
              isCurrent={index === currentCanvasIndex}
              index={canvasIndex}
            />
          ));
        })}
      </tbody>
    </DownloadTable>
  );
};

export default DownloadTableSection;
