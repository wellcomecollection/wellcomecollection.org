import styled from 'styled-components';
import Space from '@weco/common/views/components/styled/Space';
import Layout12 from '@weco/common/views/components/Layout12/Layout12';
import { font } from '@weco/common/utils/classnames';

export const PaginationWrapper = styled(Layout12)`
  text-align: right;
`;

export const ResultCountWrapper = styled(Space).attrs({
  v: {
    size: 'l',
    properties: ['padding-bottom'],
  },
  className: `font-neutral-600 ${font('lr', 6)}`,
})`
  display: flex;
  align-items: center;
`;

export const FreeAdmissionMessageWrapper = styled(Layout12)`
  display: inline-flex;
  align-items: center;
`;
