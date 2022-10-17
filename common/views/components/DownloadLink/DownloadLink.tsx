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

const DownloadLinkUnStyled = styled.a`
  position: relative;
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
}: Props) => {
  const Wrapper = linkText ? DownloadLinkStyle : DownloadLinkUnStyled;

  return (
    <Wrapper
      tabIndex={isTabbable ? undefined : -1}
      target="_blank"
      rel="noopener noreferrer"
      href={href}
      onClick={() => {
        trackEvent('download', { width, mimeType, tags: trackingTags });
        trackingEvent && trackGaEvent(trackingEvent);
      }}
    >
      <span className={linkText && 'flex-inline flex--v-center'}>
        <Icon icon={download} matchText={!!children} />
        <TextToDisplay>{linkText || children}</TextToDisplay>
        {format && <Format as="span">{format}</Format>}
      </span>
    </Wrapper>
  );
};

export default DownloadLink;
