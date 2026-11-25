import styled from 'styled-components';

import { typography } from '@weco/common/utils/classnames';
import Space from '@weco/common/views/components/styled/Space';

export const ModalContainer = styled.aside`
  ${props => props.theme.media('sm')`
    width: 24em;
  `}
`;

export const ModalTitle = styled(Space).attrs({
  as: 'h2',
  className: typography('heading', 'lg', 'strong', 'brand'),
  $v: { size: 'md', properties: ['margin-bottom'] },
})``;
