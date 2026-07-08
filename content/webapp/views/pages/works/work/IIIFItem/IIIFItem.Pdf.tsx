import { FunctionComponent } from 'react';
import styled from 'styled-components';

import { useAppContext } from '@weco/common/contexts/AppContext';
import { useKiosk } from '@weco/common/contexts/KioskContext';
import { getFileLabel } from '@weco/content/utils/works';

import IIIFItemDownload from './IIIFItem.Download';

const IframePdfViewer = styled.iframe`
  width: 100%;
  height: 90vh;
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
};

const IIIFItemPdf: FunctionComponent<Props> = ({
  src,
  label,
  fileSize,
  format,
}: Props) => {
  const { isMobileOrTabletDevice } = useAppContext();
  const substituteTitle = 'unknown title';
  const displayLabel = getFileLabel(label, substituteTitle);
  const { isKiosk } = useKiosk();
  return (
    <>
      {isMobileOrTabletDevice && !isKiosk ? (
        <IIIFItemDownload
          src={src}
          label={label}
          fileSize={fileSize}
          format={format}
        />
      ) : (
        <IframePdfViewer title={displayLabel} src={src} />
      )}
    </>
  );
};

export default IIIFItemPdf;
