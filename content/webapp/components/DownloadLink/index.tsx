import { FunctionComponent, ReactNode } from 'react';
import styled from 'styled-components';

import { download } from '@weco/common/icons';
import { trackSegmentEvent } from '@weco/common/services/conversion/track';
import { font } from '@weco/common/utils/classnames';
import Icon from '@weco/common/views/components/Icon';
import Space from '@weco/common/views/components/styled/Space';

const DownloadLinkStyle = styled.a.attrs<{ $theme: 'dark' | undefined }>(
  props => ({
    className: props.$theme === 'dark' ? font('intr', 5) : font('intb', 5),
  })
)<{ $theme: 'dark' | undefined }>`
  display: inline-block;
  white-space: nowrap;
  background: ${props =>
    props.$theme === 'dark' ? 'none' : props.theme.color('white')};
  color: ${props =>
    props.$theme === 'dark'
      ? props.theme.color('white')
      : props.theme.color('accent.green')};
  transition: color ${props => props.theme.transitionProperties};

  &:hover {
    color: ${props =>
      props.$theme
        ? props.theme.color('white')
        : props.theme.color('accent.green')};
    text-decoration-color: transparent;
  }
`;

const DownloadLinkUnStyled = styled.a<{ $theme?: 'dark' }>`
  position: relative;
`;

const Format = styled(Space).attrs<{ $theme?: 'dark' }>(props => ({
  className: props.$theme === 'dark' ? font('intr', 5) : font('intb', 5),
  $h: { size: 'm', properties: ['margin-left'] },
}))<{ $theme?: 'dark' }>`
  color: ${props =>
    props.$theme === 'dark'
      ? props.theme.color('white')
      : props.theme.color('neutral.600')};
`;

const TextToDisplay = styled.span<{ $theme?: 'dark' }>`
  margin: 0;
  text-decoration: ${props => (props.$theme === 'dark' ? 'underline' : 'none')};
  text-underline-offset: 0.1em;
`;

/**
 * TODO: figure out why Icon isn't able to be wrapped by styled...
 */
const IconWrapper = styled(Space).attrs<{
  $forceInline: boolean;
}>({ $h: { size: 's', properties: ['margin-right'] } })`
  display: inline-flex;
`;

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
  format?: string;
  width?: 'full' | number;
  mimeType: string;
  trackingTags?: string[];
  theme?: 'dark';
} & DisplayText;
const DownloadLink: FunctionComponent<Props> = ({
  isTabbable = true,
  href,
  linkText,
  format,
  width,
  mimeType,
  trackingTags = [],
  children,
  theme,
}: Props) => {
  const Wrapper = linkText ? DownloadLinkStyle : DownloadLinkUnStyled;
  const iconColor = theme === 'dark' ? 'yellow' : 'accent.green';
  return (
    <Wrapper
      $theme={theme}
      tabIndex={isTabbable ? undefined : -1}
      target="_blank"
      rel="noopener noreferrer"
      href={href}
      onClick={() => {
        trackSegmentEvent({
          name: 'download',
          properties: { width, mimeType, tags: trackingTags },
        });
      }}
    >
      <span
        style={
          linkText
            ? { display: 'inline-flex', alignItems: 'center' }
            : undefined
        }
      >
        <IconWrapper $forceInline={!!children}>
          <Icon icon={download} matchText={false} iconColor={iconColor} />
        </IconWrapper>
        <TextToDisplay $theme={theme}>{linkText || children}</TextToDisplay>
        {format && (
          <Format as="span" $theme={theme}>
            ({format})
          </Format>
        )}
      </span>
    </Wrapper>
  );
};

export default DownloadLink;
