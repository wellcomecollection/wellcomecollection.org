import styled from 'styled-components';

import { font } from '@weco/common/utils/classnames';

import Space from './Space';

const PaginationWrapper = styled(Space).attrs<{ $verticalSpacing?: 'l' | 'm' }>(
  props => ({
    className: font('intsb', -1),
    ...(props.$verticalSpacing && {
      $v: {
        size: props.$verticalSpacing,
        properties: ['padding-top', 'padding-bottom'],
      },
    }),
  })
)<{ $alignRight?: boolean }>`
  display: flex;
  justify-content: ${props =>
    props.$alignRight ? 'flex-end' : 'space-between'};
  align-items: center;
  flex-wrap: wrap;
  min-height: 32px; /* Ensures pages without Sort component still have a similar height */
`;

export default PaginationWrapper;
