import { FunctionComponent, ReactNode } from 'react';
import styled from 'styled-components';

import { download } from '@weco/common/icons';
import { font } from '@weco/common/utils/classnames';
import { dataGtmPropsToAttributes } from '@weco/common/utils/gtm';
import Icon from '@weco/common/views/components/Icon';
import Space from '@weco/common/views/components/styled/Space';
import { getFormatString } from '@weco/content/utils/iiif/v3';

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
  const iconColor = isDark ? 'yellow' : 'accent.green';
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
        'mime-type': format || 'null', // Default value requested by analyst
        trigger: 'download_link',
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

        <TextToDisplay $isDark={isDark}>{linkText || children}</TextToDisplay>

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
