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

  // Mobile non-kiosk: show download link
  if (isMobileOrTabletDevice && !isKiosk) {
    return (
      <IIIFItemDownload
        src={src}
        label={label}
        fileSize={fileSize}
        format={format}
      />
    );
  }

  // Mobile kiosk: use Google Docs viewer to fix iOS iframe scrolling issues
  if (isMobileOrTabletDevice && isKiosk) {
    const googleDocsViewerSrc = `https://docs.google.com/viewer?url=${encodeURIComponent(src)}&embedded=true`;
    return <IframePdfViewer title={displayLabel} src={googleDocsViewerSrc} />;
  }

  // Desktop: use direct PDF iframe
  return <IframePdfViewer title={displayLabel} src={src} />;
};

export default IIIFItemPdf;
