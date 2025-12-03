import styled from 'styled-components';

import { font } from '@weco/common/utils/classnames';
import Space from '@weco/common/views/components/styled/Space';

export const ModalContainer = styled.aside`
  ${props => props.theme.media('medium')`
    width: 24em;
  `}
`;

export const ModalTitle = styled(Space).attrs({
  as: 'h2',
  className: font('wb', 1),
  $v: { size: 'l', properties: ['margin-bottom'] },
})``;
