import { FunctionComponent } from 'react';
import styled from 'styled-components';

import { useAppContext } from '@weco/common/contexts/AppContext';
import { useToggles } from '@weco/common/server-data/Context';
import IIIFItemDownload from '@weco/content/components/IIIFItem/IIIFItem.Download';
import { getFileLabel } from '@weco/content/utils/works';

const IframePdfViewer = styled.iframe`
  width: 100%;
  height: 90vh;
  display: block;
  border: 0;
  margin-left: auto;
  margin-right: auto;
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
        <IframePdfViewer title={displayLabel} src={src} />
      )}
    </>
  );
};

export default IIIFItemPdf;
