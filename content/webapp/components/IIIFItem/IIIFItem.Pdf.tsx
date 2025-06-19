import styled from 'styled-components';

import { useAppContext } from '@weco/common/contexts/AppContext';
import { pdf } from '@weco/common/icons';
import { useToggles } from '@weco/common/server-data/Context';
import { font } from '@weco/common/utils/classnames';
import ButtonSolidLink from '@weco/common/views/components/Buttons/Buttons.SolidLink';
import Icon from '@weco/common/views/components/Icon';
import Space from '@weco/common/views/components/styled/Space';

const IframePdfViewer = styled.iframe`
  width: 100%;
  height: 90vh;
  display: block;
  border: 0;
  margin-left: auto;
  margin-right: auto;
`;

const PdfLink = styled(Space).attrs({
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

const IIIFItemPdf = ({
  src,
  label,
  fileSize,
}: {
  src: string;
  label?: string;
  fileSize?: string;
}) => {
  const { isMobileOrTabletDevice } = useAppContext();
  const { extendedViewer } = useToggles();
  const substituteTitle = 'unknown title';
  const displayLabel = label && label.trim() !== '-' ? label : substituteTitle;
  return (
    <>
      {isMobileOrTabletDevice && extendedViewer ? (
        <PdfLink>
          <Icon icon={pdf} sizeOverride="width: 48px; height: 48px;" />
          <Space
            className={font('intb', 5)}
            $v={{ size: 'm', properties: ['margin-top', 'margin-bottom'] }}
          >
            {displayLabel}
          </Space>
          <ButtonSolidLink
            link={src}
            text="Open"
            ariaLabel={`Open ${(displayLabel !== substituteTitle && label) || 'document'}`}
          />
          <span className={font('intr', 6)}>
            Size:{' '}
            <span className={font('intb', 6)}>{fileSize || 'unknown'}</span>
          </span>
        </PdfLink>
      ) : (
        <IframePdfViewer title={displayLabel} src={src} />
      )}
    </>
  );
};

export default IIIFItemPdf;
