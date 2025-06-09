import styled from 'styled-components';

import Space from '@weco/common/views/components/styled/Space';

export const FullWidthRow = styled(Space).attrs({
  $v: { size: 'l', properties: ['padding-top', 'padding-bottom'] },
})`
  background-color: ${props => props.theme.color('warmNeutral.300')};
`;
