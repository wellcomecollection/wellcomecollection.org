import { FunctionComponent } from 'react';
import styled from 'styled-components';

import { bornDigitalWarning } from '@weco/common/data/microcopy';
import { file, pdf } from '@weco/common/icons';
import { font } from '@weco/common/utils/classnames';
import ButtonSolidLink from '@weco/common/views/components/Buttons/Buttons.SolidLink';
import Icon from '@weco/common/views/components/Icon';
import Space from '@weco/common/views/components/styled/Space';

const DownloadContainer = styled(Space).attrs({
  $v: {
    size: 'l',
    properties: ['padding-top', 'padding-bottom'],
  },
  $h: {
    size: 'l',
    properties: ['padding-left', 'padding-right'],
  },
})`
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translateY(-50%) translateX(-50%);
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

const IIIFItemDownload: FunctionComponent<Props> = ({
  src,
  label,
  fileSize,
  showWarning = false,
}: Props) => {
  const substituteTitle = 'unknown title';
  const displayLabel = label && label.trim() !== '-' ? label : substituteTitle;
  // const icon = TODO based on format, e.g. audio, video, etc.
  return (
    <DownloadContainer>
      <Icon
        icon={src.endsWith('.pdf') ? pdf : file}
        sizeOverride="width: 48px; height: 48px;"
      />
      <Space
        className={font('intb', 5)}
        $v={{ size: 'm', properties: ['margin-top', 'margin-bottom'] }}
      >
        {displayLabel}
      </Space>
      {showWarning && (
        <div className={font('intr', 6)}>{bornDigitalWarning}</div>
      )}
      <ButtonSolidLink
        link={src}
        text="Open"
        ariaLabel={`Open ${(displayLabel !== substituteTitle && label) || 'document'}`}
      />
      <span className={font('intr', 6)}>
        Size: <span className={font('intb', 6)}>{fileSize || 'unknown'}</span>
      </span>
    </DownloadContainer>
  );
};

export default IIIFItemDownload;
