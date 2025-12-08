import { FunctionComponent, ReactNode } from 'react';
import styled from 'styled-components';

import { download } from '@weco/common/icons';
import { font } from '@weco/common/utils/classnames';
import Icon from '@weco/common/views/components/Icon';
import Space from '@weco/common/views/components/styled/Space';

const DownloadLinkStyle = styled.a.attrs<{ $isDark?: boolean }>(props => ({
  className: props.$isDark ? font('sans', -1) : font('sans-bold', -1),
}))<{ $isDark?: boolean }>`
  display: inline-block;
  white-space: nowrap;
  background: ${props => (props.$isDark ? 'none' : props.theme.color('white'))};
  color: ${props =>
    props.$isDark
      ? props.theme.color('white')
      : props.theme.color('accent.green')};
  transition: color ${props => props.theme.transitionProperties};

  &:hover {
    color: ${props =>
      props.$isDark
        ? props.theme.color('white')
        : props.theme.color('accent.green')};
    text-decoration-color: transparent;
  }
`;

const DownloadLinkUnStyled = styled.a<{ $isDark?: boolean }>`
  position: relative;
`;

const Format = styled(Space).attrs<{ $isDark?: boolean }>(props => ({
  className: props.$isDark ? font('sans', -1) : font('sans-bold', -1),
  $h: { size: 'sm', properties: ['margin-left'] },
}))<{ $isDark?: boolean }>`
  color: ${props =>
    props.$isDark
      ? props.theme.color('white')
      : props.theme.color('neutral.600')};
`;

const TextToDisplay = styled.span<{ $isDark?: boolean }>`
  margin: 0;
  text-decoration: ${props => (props.$isDark ? 'underline' : 'none')};
  text-underline-offset: 0.1em;
`;

/**
 * TODO: figure out why Icon isn't able to be wrapped by styled...
 */
const IconWrapper = styled(Space).attrs<{
  $forceInline: boolean;
}>({ $h: { size: '2xs', properties: ['margin-right'] } })`
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
  mimeType: string;
  isDark?: boolean;
} & DisplayText;
const DownloadLink: FunctionComponent<Props> = ({
  isTabbable = true,
  href,
  linkText,
  format,
  mimeType,
  children,
  isDark,
}: Props) => {
  const Wrapper = linkText ? DownloadLinkStyle : DownloadLinkUnStyled;
  const iconColor = isDark ? 'yellow' : 'accent.green';
  return (
    <Wrapper
      $isDark={isDark}
      tabIndex={isTabbable ? undefined : -1}
      target="_blank"
      rel="noopener noreferrer"
      href={href}
      data-component="download-link"
      data-gtm-trigger="download_link"
      data-gtm-mime-type={mimeType}
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
        <TextToDisplay $isDark={isDark}>{linkText || children}</TextToDisplay>
        {format && (
          <Format as="span" $isDark={isDark}>
            ({format})
          </Format>
        )}
      </span>
    </Wrapper>
  );
};

export default DownloadLink;
