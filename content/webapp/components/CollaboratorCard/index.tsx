import { FunctionComponent } from 'react';

import styled from 'styled-components';
import Icon from '@weco/common/views/components/Icon';
import { IconSvg } from '@weco/common/icons';
import NextLink from 'next/link';

const StyledLink = styled(NextLink).attrs({ className: 'font-size-6' })`
    background-color: ${props => props.theme.color('warmNeutral.300')};
    padding: ${props => props.theme.spacingUnits['3']}px;
    text-decoration: none;
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: ${props => props.theme.spacingUnits['3']}px;
    width: 100%;
    height: 48px;

    &:hover {
        text-decoration: underline;
    }

    ${props => props.theme.media('medium')`
      height: 60px;
      max-width: 256px;
  `};
`;

const CollaboratorLabel = styled.span`
    display: -webkit-box;
    text-overflow: ellipsis;
    -webkit-box-orient: vertical;
    -webkit-line-clamp: 2;
    overflow: hidden;

    // line-clamp does not work on older browsers, so set a max-height as fallback
    max-height: 42px;
`;

const IconWrapper = styled.div`
    display: flex;
    justify-content: center;
    align-items: center;
    padding: ${props => props.theme.spacingUnits['3']}px;
    background-color: ${props => props.theme.color('neutral.700')};
    color: white;
    border-radius: 2px;
`;

type Props = {
  href: string;
  label: string;
  icon: IconSvg;
};

const CollaboratorCard: FunctionComponent<Props> = ({ href, label, icon }) => {
  return (
    <StyledLink href={href} className="link-reset">
      <CollaboratorLabel>{label}</CollaboratorLabel>
      <IconWrapper>
        <Icon icon={icon} />
      </IconWrapper>
    </StyledLink>
  );
};

export default CollaboratorCard;
