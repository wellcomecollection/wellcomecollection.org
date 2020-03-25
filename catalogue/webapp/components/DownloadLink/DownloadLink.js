// @flow
import { trackEvent } from '@weco/common/utils/ga';
import styled from 'styled-components';
import { font, classNames } from '@weco/common/utils/classnames';
import type { GaEvent } from '@weco/common/utils/ga';
import Icon from '@weco/common/views/components/Icon/Icon';
import Space from '@weco/common/views/components/styled/Space';

const DownloadLinkStyle = styled.a.attrs({
  className: classNames({
    [font('hnm', 5)]: true,
  }),
})`
  display: inline-block;
  white-space: nowrap;
  background: ${props => props.theme.colors.white};
  color: ${props => props.theme.colors.green};
  text-decoration: none;
  .icon__shape {
    fill: currentColor;
  }
  .icon__canvas {
    height: 1.3em;
  }
`;
type Props = {|
  isTabbable?: boolean,
  href: string,
  trackingEvent: GaEvent,
  linkText: string,
  format: ?('PDF' | 'PLAIN' | 'JPG' | 'MP4' | 'MP3'),
|};
const DownloadLink = ({
  isTabbable = true,
  href,
  trackingEvent,
  linkText,
  format,
}: Props) => (
  <DownloadLinkStyle
    tabIndex={isTabbable ? null : -1}
    target="_blank"
    rel="noopener noreferrer"
    href={href}
    onClick={() => {
      trackEvent(trackingEvent);
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
            [font('hnm', 5)]: true,
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
