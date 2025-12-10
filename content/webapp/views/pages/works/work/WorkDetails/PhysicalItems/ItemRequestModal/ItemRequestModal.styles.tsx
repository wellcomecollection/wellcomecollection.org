import styled from 'styled-components';

import Space from '@weco/common/views/components/styled/Space';

export const CTAs = styled(Space).attrs({
  $v: { size: 'md', properties: ['margin-top'] },
})``;

export const Header = styled(Space).attrs({
  $v: { size: 'sm', properties: ['margin-bottom'] },
})`
  display: flex;
  justify-content: space-between;
  align-items: center;
`;
