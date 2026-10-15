import NextLink from 'next/link';
import { FunctionComponent } from 'react';
import styled, { css } from 'styled-components';

import { arrow } from '@weco/common/icons';
import { LinkProps } from '@weco/common/model/link-props';
import { typography } from '@weco/common/utils/classnames';
import Icon from '@weco/common/views/components/Icon';
import { designSystemColor } from '@weco/common/views/themes/config';

type StyleProps = { $isOnDark: boolean; $isStacked?: boolean };

// Only here so the link and button can underline it on hover
const Label = styled.span``;

const baseStyles = css<StyleProps>`
  display: inline-flex;
  color: ${props =>
    designSystemColor(props.$isOnDark ? 'neutral.10' : 'neutral.70')};
  text-decoration: none;

  ${props =>
    props.$isStacked
      ? `
    flex-direction: column;
    align-items: flex-start;
  `
      : `
    align-items: center;
    ${props.theme.makeSpacePropertyValues('sm', ['column-gap'])}
  `}
`;

const disabledStyles = css`
  color: ${designSystemColor('ui.grey.40')};
  cursor: not-allowed;
`;

const StyledLink = styled(NextLink)<StyleProps>`
  ${baseStyles}

  &:hover ${Label} {
    text-decoration: underline;
  }
`;

const StyledButton = styled.button<StyleProps>`
  ${baseStyles}

  &:not(:disabled):hover ${Label} {
    text-decoration: underline;
  }

  &:disabled {
    ${disabledStyles}
  }
`;

// Not a link, so it isn't focusable; screen readers hear '… unavailable'
const Disabled = styled.span<StyleProps>`
  ${baseStyles}
  ${disabledStyles}
`;

type AsLink = {
  // Leave out to show the disabled state
  link?: LinkProps;
  onClick?: never;
  disabled?: never;
};

type AsButton = { link?: never; onClick: () => void; disabled?: boolean };

type Props = {
  direction: 'previous' | 'next';
  // What a screen reader hears instead of 'Prev'/'Next', e.g. 'Next page'
  label: string;
  isOnDark?: boolean;
  // Arrow above the label, as in scrollable rows of cards
  isStacked?: boolean;
} & (AsLink | AsButton);

const PrevNextLink: FunctionComponent<Props> = ({
  direction,
  label,
  isOnDark = false,
  isStacked,
  link,
  onClick,
  disabled,
}) => {
  const isPrevious = direction === 'previous';
  const arrowFirst = isPrevious || isStacked;
  const isUnavailableLink = !onClick && !link;
  const content = (
    <>
      {arrowFirst && (
        <Icon icon={arrow} rotate={isPrevious ? 180 : undefined} />
      )}
      <Label aria-hidden="true">{isPrevious ? 'Prev' : 'Next'}</Label>
      {/* A disabled button is already announced as unavailable */}
      <span className="visually-hidden">
        {isUnavailableLink ? `${label} unavailable` : label}
      </span>
      {!arrowFirst && <Icon icon={arrow} />}
    </>
  );
  const sharedProps = {
    className: typography('body', 'sm', 'regular'),
    $isOnDark: isOnDark,
    $isStacked: isStacked,
  };

  if (onClick) {
    return (
      <StyledButton
        {...sharedProps}
        data-component="prev-next-link"
        type="button"
        onClick={onClick}
        disabled={disabled}
      >
        {content}
      </StyledButton>
    );
  }

  return link ? (
    <StyledLink {...link} {...sharedProps} data-component="prev-next-link">
      {content}
    </StyledLink>
  ) : (
    <Disabled {...sharedProps} data-component="prev-next-link">
      {content}
    </Disabled>
  );
};

export default PrevNextLink;
