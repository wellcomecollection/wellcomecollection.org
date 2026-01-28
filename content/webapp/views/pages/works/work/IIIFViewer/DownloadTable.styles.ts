import styled from 'styled-components';

import { font } from '@weco/common/utils/classnames';
import Space from '@weco/common/views/components/styled/Space';

export const DownloadTableContainer = styled.div`
  overflow-y: auto;
`;

export const DownloadTitle = styled(Space).attrs({
  as: 'h2',
  className: font('brand', 0),
  $v: { size: 'sm', properties: ['margin-top'] },
})`
  padding-left: ${props => props.theme.spacingUnit * 7}px;
`;

export const DownloadTable = styled.table.attrs({
  className: font('sans', -1),
})`
  border-collapse: collapse;
  white-space: nowrap;
  width: 100%;

  th,
  td {
    text-align: left;
    overflow: hidden;
    text-overflow: ellipsis;
    padding: ${props => props.theme.spacingUnit * 2}px;
  }

  th:first-child,
  td:first-child {
    padding-left: ${props => props.theme.spacingUnit * 7}px;
  }

  th:nth-child(2),
  td:nth-child(2) {
    width: 120px;
  }

  th:last-child,
  td:last-child {
    width: 100px;
    text-align: right;
    padding-right: ${props => props.theme.spacingUnit * 7}px;
  }
`;

export const IconWrapper = styled(Space).attrs({
  $h: { size: 'xs', properties: ['margin-right'] },
})`
  display: inline-flex;
`;

export const StyledTr = styled.tr<{ $isCurrent?: boolean }>`
  ${props =>
    props.$isCurrent &&
    `background-color: ${props.theme.color('neutral.700')};`}
`;
