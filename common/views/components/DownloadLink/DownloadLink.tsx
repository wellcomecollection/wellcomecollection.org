import { trackEvent as trackGaEvent, GaEvent } from '@weco/common/utils/ga';
import styled from 'styled-components';
import { font } from '@weco/common/utils/classnames';
import Icon from '@weco/common/views/components/Icon/Icon';
import Space from '@weco/common/views/components/styled/Space';
import { FunctionComponent, ReactNode } from 'react';
import { trackEvent } from '@weco/common/services/conversion/track';
import { download } from '@weco/common/icons';

const DownloadLinkStyle = styled.a.attrs({
  className: font('intb', 5),
})`
  display: inline-block;
  white-space: nowrap;
  background: ${props => props.theme.color('white')};
  color: ${props => props.theme.color('accent.green')};
  text-decoration: none;
`;

const Format = styled(Space).attrs({
  h: { size: 'm', properties: ['margin-left'] },
  className: font('intb', 5),
})`
  color: ${props => props.theme.color('neutral.600')};
`;

const TextToDisplay = styled.span`
  margin: 0;
  text-decoration: none;
  &:hover,
  &:focus {
    text-decoration: underline;
  }
`;

export type DownloadFormat = 'PDF' | 'PLAIN' | 'JPG' | 'MP4' | 'MP3';

type DisplayText =
  | {
      linkText?: never;
      children: ReactNode;
    }
  | {
      children?: never;
      linkText: string;
    };

type Props = {
  isTabbable?: boolean;
  href: string;
  trackingEvent?: GaEvent;
  format?: DownloadFormat;
  width?: 'full' | number;
  mimeType: string;
  trackingTags?: string[];
} & DisplayText;
const DownloadLink: FunctionComponent<Props> = ({
  isTabbable = true,
  href,
  trackingEvent,
  linkText,
  format,
  width,
  mimeType,
  trackingTags = [],
  children,
}: Props) => (
  <DownloadLinkStyle
    tabIndex={isTabbable ? undefined : -1}
    target="_blank"
    rel="noopener noreferrer"
    href={href}
    onClick={() => {
      trackEvent('download', { width, mimeType, tags: trackingTags });
      trackingEvent && trackGaEvent(trackingEvent);
    }}
  >
    <span className="flex-inline flex--v-center">
      <Icon icon={download} />
      <TextToDisplay>{linkText || children}</TextToDisplay>
      {format && (
        <Space
          as="span"
          h={{ size: 'm', properties: ['margin-left'] }}
          className={`${font('intb', 5)} font-neutral-600`}
        >
          {format}
        </Space>
      )}
    </span>
  </DownloadLinkStyle>
);

export default DownloadLink;
