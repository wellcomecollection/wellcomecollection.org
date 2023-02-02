import styled from 'styled-components';
import Space from '@weco/common/views/components/styled/Space';

const DotWrapper = styled(Space).attrs({
  as: 'span',
  h: { size: 'xs', properties: ['margin-right'] },
  className: 'flex flex--v-center',
})``;

export default DotWrapper;
