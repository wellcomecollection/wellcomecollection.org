import styled from 'styled-components';

import { font } from '@weco/common/utils/classnames';
import Space from '@weco/common/views/components/styled/Space';

export const ShowPasswordButton = styled.button.attrs({ type: 'button' })`
  background: none;
  border: none;
`;

export const RulesListWrapper = styled(Space).attrs({
  className: font('intr', 5),
  $h: { size: 'm', properties: ['padding-left', 'padding-right'] },
  $v: { size: 'm', properties: ['padding-top', 'padding-bottom'] },
})`
  border: 1px solid ${props => props.theme.color('neutral.300')};
  border-radius: ${props => props.theme.borderRadiusUnit}px;
`;

export const RulesListItem = styled(Space).attrs({
  as: 'li',
  $v: { size: 's', properties: ['margin-bottom'] },
})`
  display: flex;
  align-items: center;
`;
