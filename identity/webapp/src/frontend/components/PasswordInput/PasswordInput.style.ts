import styled from 'styled-components';
import Space from '@weco/common/views/components/styled/Space';

export const ShowPasswordButton = styled.button.attrs({ type: 'button' })`
  position: absolute;
  right: 0;
  height: 55px;
  width: 55px;
  background: none;
  border: none;
`;

export const RulesList = styled(Space).attrs({
  as: 'ul',
  className: 'plain-list',
  h: { size: 'm', properties: ['padding-left', 'padding-right'] },
  v: { size: 'm', properties: ['padding-top', 'padding-bottom'] },
})`
  border: 1px solid ${props => props.theme.color('smoke')};
  border-radius: ${props => props.theme.borderRadiusUnit}px;
`;
