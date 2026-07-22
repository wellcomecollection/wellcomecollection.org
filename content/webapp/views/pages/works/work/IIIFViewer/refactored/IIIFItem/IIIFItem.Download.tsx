import { FunctionComponent } from 'react';
import styled from 'styled-components';

import { useKiosk } from '@weco/common/contexts/KioskContext';
import { bornDigitalWarning } from '@weco/common/data/microcopy';
import { file, pdf } from '@weco/common/icons';
import { typography } from '@weco/common/utils/classnames';
import Buttons from '@weco/common/views/components/Buttons';
import Icon from '@weco/common/views/components/Icon';
import Space from '@weco/common/views/components/styled/Space';
import { getFileLabel } from '@weco/content/utils/works';

const DownloadContainer = styled(Space).attrs({
  $v: { size: 'md', properties: ['padding-top', 'padding-bottom'] },
  $h: { size: 'md', properties: ['padding-left', 'padding-right'] },
})`
  max-width: 640px;
  margin: auto;
  background-color: ${props => props.theme.color('neutral.700')};
  border-radius: 6px;
  display: flex;
  align-items: center;
  flex-direction: column;
  gap: 10px;
  text-align: center;

  a {
    min-width: 240px;

    span {
      margin: auto;
    }
  }
`;

type Props = {
  src: string;
  label?: string;
  fileSize?: string;
  format?: string;
  showWarning?: boolean;
};

function isPdf(src: string, format?: string): boolean {
  if (format) return format === 'application/pdf';
  try {
    return new URL(src).pathname.toLowerCase().endsWith('.pdf');
  } catch {
    return src.toLowerCase().endsWith('.pdf');
  }
}

const IIIFItemDownload: FunctionComponent<Props> = ({
  src,
  label,
  fileSize,
  format,
  showWarning = false,
}: Props) => {
  const { isKiosk } = useKiosk();
  const substituteTitle = 'unknown title';
  const displayLabel = getFileLabel(label, substituteTitle);
  const isFilePdf = isPdf(src, format);
  const action = isFilePdf ? 'Open' : 'Download';

  return (
    <DownloadContainer>
      <Icon
        icon={isFilePdf ? pdf : file}
        sizeOverride="width: 48px; height: 48px;"
      />

      <Space
        className={typography('body', 'md', 'strong')}
        $v={{ size: 'sm', properties: ['margin-top', 'margin-bottom'] }}
      >
        {displayLabel}
      </Space>

      {showWarning && !isKiosk && (
        <div className={typography('body', 'sm', 'regular')}>
          {bornDigitalWarning}
        </div>
      )}

      {!isKiosk && (
        <Buttons
          variant="ButtonSolidLink"
          link={src}
          text={action}
          ariaLabel={`${action} ${(displayLabel !== substituteTitle && label) || 'document'}`}
          dataGtmProps={{
            trigger: 'canvas_download_link',
            'mime-type': format || 'null', // Default value requested by analyst
          }}
        />
      )}

      <span className={typography('body', 'sm', 'regular')}>
        Size:{' '}
        <span className={typography('body', 'sm', 'strong')}>
          {fileSize || 'unknown'}
        </span>
      </span>
    </DownloadContainer>
  );
};

export default IIIFItemDownload;
