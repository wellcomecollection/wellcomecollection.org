import styled from 'styled-components';
import { font } from '@weco/common/utils/classnames';
import Space from './Space';

const PaginationWrapper = styled(Space).attrs<{ verticalSpacing?: 'l' | 'm' }>(
  props => ({
    className: font('intb', 5),
    ...(props.verticalSpacing && {
      v: {
        size: props.verticalSpacing,
        properties: ['padding-top', 'padding-bottom'],
      },
    }),
  })
)<{ alignRight?: boolean; verticalSpacing?: 'l' | 'm' }>`
  display: flex;
  justify-content: ${props =>
    props.alignRight ? 'flex-end' : 'space-between'};
  align-items: center;
  flex-wrap: wrap;
`;

export default PaginationWrapper;
