import { FunctionComponent, ReactNode } from 'react';
import styled, { css } from 'styled-components';

import { download } from '@weco/common/icons';
import { typography } from '@weco/common/utils/classnames';
import { dataGtmPropsToAttributes } from '@weco/common/utils/gtm';
import Icon from '@weco/common/views/components/Icon';
import Space from '@weco/common/views/components/styled/Space';
import { PinnableColor } from '@weco/common/views/themes/config';

const DownloadLinkStyle = styled.a.attrs<{ $isDark?: boolean }>(props => ({
  className: props.$isDark
    ? typography('body', 'md', 'regular')
    : typography('body', 'md', 'strong'),
}))<{ $isDark?: boolean }>`
  display: inline-block;
  white-space: nowrap;
  background: ${props =>
    props.$isDark || props.theme.brandUpdate
      ? 'none'
      : props.theme.color('white')};
  color: ${props =>
    props.$isDark
      ? props.theme.color('white')
      : props.theme.color({ brand: 'neutral.70', legacy: 'accent.green' })};
  transition: color ${props => props.theme.transitionProperties};

  &:hover {
    color: ${props =>
      props.$isDark
        ? props.theme.color('white')
        : props.theme.color({ brand: 'neutral.70', legacy: 'accent.green' })};
    text-decoration-color: transparent;
  }
`;

const DownloadLinkUnStyled = styled.a<{ $isDark?: boolean }>`
  position: relative;
`;

const Format = styled(Space).attrs<{ $isDark?: boolean }>(props => ({
  className: props.$isDark
    ? typography('body', 'md', 'regular')
    : typography('body', 'md', 'strong'),
  $h: { size: 'sm', properties: ['margin-left'] },
}))<{ $isDark?: boolean }>`
  color: ${props =>
    props.$isDark
      ? props.theme.color('white')
      : props.theme.color({ brand: 'neutral.70', legacy: 'neutral.600' })};
`;

const TextToDisplay = styled.span<{ $isDark?: boolean; $isStyled?: boolean }>`
  margin: 0;
  text-decoration: ${props =>
    props.$isDark || (props.theme.brandUpdate && props.$isStyled)
      ? 'underline'
      : 'none'};
  text-underline-offset: 0.1em;

  ${props =>
    props.theme.brandUpdate &&
    props.$isStyled &&
    !props.$isDark &&
    css`
      a:hover & {
        text-decoration: none;
      }
    `}
`;

const IconWrapper = styled(Space).attrs<{
  $forceInline: boolean;
}>({ $h: { size: 'xs', properties: ['margin-right'] } })`
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

function getFormatString(format?: string): string {
  switch (format) {
    case 'application/pdf':
      return 'PDF';
    case 'text/plain':
      return 'PLAIN';
    case 'image/jpeg':
      return 'JPG';
    case 'video/mp4':
      return 'MP4';
    case 'video/webm':
      return 'WebM';
    case 'audio/mp3':
    case 'audio/x-mpeg-3':
      return 'MP3';
    default:
      return 'unknown format';
  }
}

type Props = {
  isTabbable?: boolean;
  href: string;
  format?: string;
  isDark?: boolean;
} & DisplayText;

const DownloadLink: FunctionComponent<Props> = ({
  isTabbable = true,
  href,
  linkText,
  format,
  children,
  isDark,
}: Props) => {
  const Wrapper = linkText ? DownloadLinkStyle : DownloadLinkUnStyled;
  const iconColor: PinnableColor = isDark
    ? 'yellow'
    : { brand: 'neutral.70', legacy: 'accent.green' };
  const readableFormat = format ? getFormatString(format) : undefined;

  return (
    <Wrapper
      $isDark={isDark}
      tabIndex={isTabbable ? undefined : -1}
      target="_blank"
      rel="noopener noreferrer"
      href={href}
      data-component="download-link"
      {...dataGtmPropsToAttributes({
        'mime-type': format,
      })}
    >
      <span
        style={
          linkText
            ? { display: 'inline-flex', alignItems: 'center' }
            : undefined
        }
      >
        <IconWrapper $forceInline={!!children}>
          <Icon icon={download} matchText={!!children} iconColor={iconColor} />
        </IconWrapper>

        <TextToDisplay $isDark={isDark} $isStyled={!!linkText}>
          {linkText || children}
        </TextToDisplay>

        {readableFormat && (
          <Format as="span" $isDark={isDark}>
            ({readableFormat})
          </Format>
        )}
      </span>
    </Wrapper>
  );
};

export default DownloadLink;
