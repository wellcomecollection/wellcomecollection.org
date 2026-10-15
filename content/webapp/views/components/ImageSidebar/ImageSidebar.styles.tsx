import styled from 'styled-components';

import Space from '@weco/common/views/components/styled/Space';
import { pageBackgroundColor } from '@weco/common/views/themes/config';

export const SidebarWrapper = styled(Space).attrs({
  $h: { size: 'md', properties: ['padding-left', 'padding-right'] },
  $v: { size: 'md', properties: ['padding-top', 'padding-bottom'] },
})`
  position: sticky;
  top: 0;
  flex: 0 0 50%;
  height: 100vh;
  overflow-y: auto;
  border-left: 1px solid ${props => props.theme.color('neutral.300')};
  background-color: ${props => props.theme.color(pageBackgroundColor)};
  color: ${props => props.theme.color('black')};
`;

export const CloseButton = styled.button.attrs({ type: 'button' })`
  appearance: none;
  display: block;
  margin-left: auto;
  padding: 0;
  border: 0;
  background: transparent;
  color: inherit;
  cursor: pointer;
`;
