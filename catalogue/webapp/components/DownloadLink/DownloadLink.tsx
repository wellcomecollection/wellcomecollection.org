import { trackEvent as trackGaEvent, GaEvent } from '@weco/common/utils/ga';
import styled from 'styled-components';
import { font } from '@weco/common/utils/classnames';
import Icon from '@weco/common/views/components/Icon/Icon';
import Space from '@weco/common/views/components/styled/Space';
import { FunctionComponent } from 'react';
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
  .icon__shape {
    fill: currentColor;
  }
`;

const Wrapper = styled.span`
  display: inline-flex;
  align-items: center;
`;

const Link = styled.span.attrs({
  className: 'underline-on-hover',
})``;

const Format = styled(Space).attrs({
  h: { size: 'm', properties: ['margin-left'] },
  className: `${font('intb', 5)} font-neutral-600`,
})``;

export type DownloadFormat = 'PDF' | 'PLAIN' | 'JPG' | 'MP4' | 'MP3';
type Props = {
  isTabbable?: boolean;
  href: string;
  trackingEvent: GaEvent;
  linkText: string;
  format?: DownloadFormat;
  width?: 'full' | number;
  mimeType: string;
  trackingTags?: string[];
};
const DownloadLink: FunctionComponent<Props> = ({
  isTabbable = true,
  href,
  trackingEvent,
  linkText,
  format,
  width,
  mimeType,
  trackingTags = [],
}: Props) => (
  <DownloadLinkStyle
    tabIndex={isTabbable ? undefined : -1}
    target="_blank"
    rel="noopener noreferrer"
    href={href}
    onClick={() => {
      trackEvent('download', { width, mimeType, tags: trackingTags });
      trackGaEvent(trackingEvent);
    }}
  >
    <Wrapper>
      <Icon icon={download} />
      <Link>{linkText}</Link>
      {format && <Format as="span">{format}</Format>}
    </Wrapper>
  </DownloadLinkStyle>
);

export default DownloadLink;
