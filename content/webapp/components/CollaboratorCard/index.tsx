import NextLink from 'next/link';
import { FunctionComponent } from 'react';
import styled from 'styled-components';

import { IconSvg } from '@weco/common/icons';
import { font } from '@weco/common/utils/classnames';
import Icon from '@weco/common/views/components/Icon';

const StyledLink = styled(NextLink).attrs({
  className: font('intr', 6),
})`
  background-color: ${props => props.theme.color('warmNeutral.300')};
  padding: ${props => props.theme.spacingUnits['3']}px;
  text-decoration: none;
  display: flex;
  align-items: center;
  flex-direction: row-reverse;
  justify-content: start;
  gap: ${props => props.theme.spacingUnits['3']}px;
  width: 100%;
  height: 48px;
  border-radius: 2px;

  &:hover {
    text-decoration: underline;
  }

  ${props => props.theme.media('medium')`
      height: 60px;
      max-width: 256px;
      flex-direction: row;
      justify-content: space-between;
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
  padding: ${props => props.theme.spacingUnits['1']}px;
  background-color: ${props => props.theme.color('neutral.700')};
  color: white;
  border-radius: 2px;

  ${props =>
    props.theme.media('medium')(`padding: ${props.theme.spacingUnits['3']}px;`)}
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
