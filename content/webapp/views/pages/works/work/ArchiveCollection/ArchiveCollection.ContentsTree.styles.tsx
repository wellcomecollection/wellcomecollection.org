import styled from 'styled-components';

import { typography } from '@weco/common/utils/classnames';
import { controlDimensions } from '@weco/content/views/pages/works/work/work.helpers';

export {
  Tree,
  TreeBand,
  TreeInstructions,
} from '@weco/content/views/pages/works/work/work.styles';

// Each row's its own <table> (real tables can't nest recursively), so
// nth-child can't stripe them. $isEvenRow comes from visible-row
// position instead (see `rowIndexById`), which also survives rows taller
// than one line. $indentPx cancels out the ancestor <ul> indentation so
// the stripe still spans full width at any depth, then reapplies it as
// padding so content doesn't shift.
export const ContentsTable = styled.table.attrs({
  className: typography('body', 'sm', 'regular'),
})<{ $isEvenRow?: boolean; $indentPx?: number; $hasControl?: boolean }>`
  border-collapse: collapse;
  table-layout: fixed;
  margin-left: -${props => props.$indentPx ?? 0}px;
  width: calc(100% + ${props => props.$indentPx ?? 0}px);

  background: ${props =>
    props.$isEvenRow === undefined
      ? 'transparent'
      : props.theme.color(props.$isEvenRow ? 'white' : 'neutral.200')};

  /* Clicking anywhere in a row toggles it open/closed (see ListItem's
     onClick), but a leaf row's click is a no-op, so it shouldn't look
     clickable either. */
  ${props => props.$hasControl && `cursor: pointer;`}

  th,
  td {
    text-align: left;
  }

  td {
    padding: 8px 10px 8px 0;
  }

  th {
    padding: 12px 10px 12px 0;
    font-weight: bold;
  }

  /* The header has no ancestor <ul> indentation to line up with (it's a
     plain table, not part of the tree), so it gets a fixed left padding
     rather than $indentPx. */
  th:first-child {
    padding-left: 10px;
  }

  td:first-child {
    padding-left: ${props => props.$indentPx ?? 0}px;
  }

  th:nth-child(2),
  td:nth-child(2) {
    width: 160px;
  }

  th:nth-child(3),
  td:nth-child(3) {
    width: 110px;
  }
`;

export const NameCell = styled.span`
  display: inline-flex;
  align-items: center;
  gap: ${props => props.theme.spacingUnit}px;
  min-width: 0;
  max-width: 100%;

  .icon {
    flex: 0 0 auto;
  }

  a {
    flex: 1 1 auto;
    min-width: 0;
    display: block;
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
    text-decoration: none;

    &:focus,
    &:hover {
      text-decoration: underline;
    }
  }
`;

export const ChevronSpacer = styled.span`
  display: inline-block;
  flex: 0 0 auto;
  width: ${controlDimensions.controlWidth}px;
  height: ${controlDimensions.controlHeight}px;
`;

export const ShowMoreButton = styled.button.attrs({
  type: 'button',
  className: typography('body', 'sm', 'regular'),
})`
  display: inline-flex;
  align-items: center;
  gap: ${props => props.theme.spacingUnit}px;
  background: none;
  border: none;
  padding: 0;
  color: inherit;
  cursor: pointer;
  text-decoration: none;

  &:focus,
  &:hover {
    text-decoration: underline;
  }

  &:disabled {
    cursor: default;
    text-decoration: none;
  }
`;

export const ShowMoreCount = styled.span`
  color: ${props => props.theme.color('neutral.600')};
`;
