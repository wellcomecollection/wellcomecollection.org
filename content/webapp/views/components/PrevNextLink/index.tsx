import NextLink from 'next/link';
import { FunctionComponent } from 'react';
import styled, { css } from 'styled-components';

import { arrow } from '@weco/common/icons';
import { LinkProps } from '@weco/common/model/link-props';
import { typography } from '@weco/common/utils/classnames';
import Icon from '@weco/common/views/components/Icon';
import { designSystemColor } from '@weco/common/views/themes/config';

const baseStyles = css`
  display: inline-flex;
  align-items: center;
  ${props => props.theme.makeSpacePropertyValues('sm', ['column-gap'])}
  color: ${designSystemColor('neutral.10')};
  text-decoration: none;
`;

const Label = styled.span``;

const StyledLink = styled(NextLink)`
  ${baseStyles}

  &:hover ${Label} {
    text-decoration: underline;
  }
`;

// Not a link, so it isn't focusable; screen readers hear '… unavailable'
const Disabled = styled.span`
  ${baseStyles}
  color: ${designSystemColor('ui.grey.40')};
  cursor: not-allowed;
`;

type Props = {
  direction: 'previous' | 'next';
  // Leave out to show the disabled state
  link?: LinkProps;
  // What a screen reader hears instead of 'Prev'/'Next', e.g. 'Next page'
  label: string;
};

const PrevNextLink: FunctionComponent<Props> = ({ direction, link, label }) => {
  const isPrevious = direction === 'previous';
  const content = (
    <>
      {isPrevious && <Icon icon={arrow} rotate={180} />}
      <Label aria-hidden="true">{isPrevious ? 'Prev' : 'Next'}</Label>
      <span className="visually-hidden">
        {link ? label : `${label} unavailable`}
      </span>
      {!isPrevious && <Icon icon={arrow} />}
    </>
  );
  const className = typography('body', 'sm', 'regular');

  return link ? (
    <StyledLink {...link} className={className} data-component="prev-next-link">
      {content}
    </StyledLink>
  ) : (
    <Disabled className={className} data-component="prev-next-link">
      {content}
    </Disabled>
  );
};

export default PrevNextLink;
