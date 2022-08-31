import styled from 'styled-components';
import Space from '@weco/common/views/components/styled/Space';
import { classNames, font } from '@weco/common/utils/classnames';

export const ShowPasswordButton = styled.button.attrs({ type: 'button' })`
  height: 55px;
  width: 55px;
  background: none;
  border: none;
`;

export const RulesListWrapper = styled(Space).attrs({
  h: { size: 'm', properties: ['padding-left', 'padding-right'] },
  v: { size: 'm', properties: ['padding-top', 'padding-bottom'] },
  className: classNames({
    [font('intr', 5)]: true,
  }),
})`
  border: 1px solid ${props => props.theme.color('smoke')};
  border-radius: ${props => props.theme.borderRadiusUnit}px;
`;

export const RulesList = styled.ul.attrs({
  className: 'plain-list no-margin no-padding',
})``;

export const RulesListItem = styled(Space).attrs({
  as: 'li',
  h: { size: 's', properties: ['margin-bottom'] },
})`
  display: flex;
  align-items: center;
`;
