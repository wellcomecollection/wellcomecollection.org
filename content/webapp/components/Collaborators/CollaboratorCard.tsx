import { FunctionComponent } from 'react';

import styled from 'styled-components';
import { StyledLink } from '../ArchiveTree/ArchiveTree.styles';
import Icon from '@weco/common/views/components/Icon';
import { user } from '@weco/common/icons';
import { ConceptType } from '../../services/wellcome/catalogue/types';

type Props = {
  id: string;
  label: string;
  type: ConceptType;
};

const StyledCard = styled(StyledLink)`
  background-color: ${props => props.theme.color('warmNeutral.300')};
  padding: ${props => props.theme.spacingUnits['3']}px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;
  height: 48px;
  margin-left: 0;

  ${props => props.theme.media('medium')`
      height: 60px;
      width: 221px;
  `};

  ${props => props.theme.media('large')`
      width: 256px;
  `};
`;

const IconWrapper = styled.div`
  padding: ${props => props.theme.spacingUnits['3']}px;
  background-color: ${props => props.theme.color('neutral.700')};
  color: white;
  border-radius: 2px;
`;

const CollaboratorCard: FunctionComponent<Props> = ({
  id,
  label,
  type,
}) => {

  return (
    <StyledCard href={`/concepts/${id}`}>
      {label}
      <IconWrapper>
        {type === 'Person' && <Icon icon={user} />}
        {/* TODO: We don't have an organisation icon at the moment. */}
        {type === 'Organisation' && <Icon icon={user} />}
      </IconWrapper>
    </StyledCard>
  );
};

export default CollaboratorCard;
