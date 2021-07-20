import { trackEvent as trackGaEvent, GaEvent } from '@weco/common/utils/ga';
import styled from 'styled-components';
import { font, classNames } from '@weco/common/utils/classnames';
import Icon from '@weco/common/views/components/Icon/Icon';
import Space from '@weco/common/views/components/styled/Space';
import { FunctionComponent } from 'react';
import { trackEvent } from '@weco/common/services/conversion/track';

const DownloadLinkStyle = styled.a.attrs({
  className: classNames({
    [font('hnb', 5)]: true,
  }),
})`
  display: inline-block;
  white-space: nowrap;
  background: ${props => props.theme.color('white')};
  color: ${props => props.theme.color('green')};
  text-decoration: none;
  .icon__shape {
    fill: currentColor;
  }
`;

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
    <span className="flex-inline flex--v-center">
      <Icon name="download" />
      <span className="underline-on-hover">{linkText}</span>
      {format && (
        <Space
          as="span"
          h={{ size: 'm', properties: ['margin-left'] }}
          className={classNames({
            [font('hnb', 5)]: true,
            'font-pewter': true,
          })}
        >
          {format}
        </Space>
      )}
    </span>
  </DownloadLinkStyle>
);

export default DownloadLink;
