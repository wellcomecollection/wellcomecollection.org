import { FunctionComponent } from 'react';
import styled from 'styled-components';

import { useAppContext } from '@weco/common/contexts/AppContext';
import { useToggles } from '@weco/common/server-data/Context';
import { getFileLabel } from '@weco/content/utils/works';

import IIIFItemDownload from './IIIFItem.Download';

const IframePdfViewer = styled.iframe<{ $isInViewer?: boolean }>`
  width: 100%;
  height: ${props => props.$isInViewer ? '100%' : '90vh'};
  display: block;
  margin-left: auto;
  margin-right: auto;
  border: none;
`;

type Props = {
  src: string;
  label?: string;
  fileSize?: string;
  format?: string;
  isInViewer?: boolean;
};

const IIIFItemPdf: FunctionComponent<Props> = ({
  src,
  label,
  fileSize,
  format,
  isInViewer,
}: Props) => {
  const { isMobileOrTabletDevice } = useAppContext();
  const { extendedViewer } = useToggles();
  const substituteTitle = 'unknown title';
  const displayLabel = getFileLabel(label, substituteTitle);

  return (
    <>
      {isMobileOrTabletDevice && extendedViewer ? (
        <IIIFItemDownload
          src={src}
          label={label}
          fileSize={fileSize}
          format={format}
        />
      ) : (
        <IframePdfViewer title={displayLabel} src={src} $isInViewer={isInViewer} />
      )}
    </>
  );
};

export default IIIFItemPdf;
