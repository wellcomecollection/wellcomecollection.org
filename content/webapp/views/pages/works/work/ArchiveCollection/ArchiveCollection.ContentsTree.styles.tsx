import styled from 'styled-components';

import { typography } from '@weco/common/utils/classnames';
import { controlDimensions } from '@weco/content/views/pages/works/work/work.helpers';

export {
  Tree,
  TreeHeadings,
  TreeInstructions,
} from '@weco/content/views/pages/works/work/work.styles';

// Each row is its own one-row <table> nested arbitrarily deep inside
// <ul>/<li>, so CSS nth-child can't produce a continuous odd/even
// alternation across the whole visible tree -- $isEvenRow is worked out
// from each row's position in document order instead (see `rowIndex` in
// ArchiveTree/index.tsx) and applied directly as a background colour,
// which (unlike a repeating-gradient background) keeps working if a row
// ends up taller than the single-line case below.
//
// Nested <ul>s also indent each row's <table> via ancestor padding-left,
// so a deeply-nested row's own table starts partway across the tree --
// $indentPx (see ArchiveCollection.ContentsTree.ItemRenderer.tsx) is
// exactly that indentation, cancelled out with a negative margin/matching
// width increase so the background always spans the tree's full width,
// then reapplied as padding on the first cell so the row's content still
// lines up where it visually was.
export const ContentsTable = styled.table.attrs({
  className: typography('body', 'sm', 'regular'),
})<{ $isEvenRow?: boolean; $indentPx?: number }>`
  border-collapse: collapse;
  table-layout: fixed;
  margin-left: -${props => props.$indentPx ?? 0}px;
  width: calc(100% + ${props => props.$indentPx ?? 0}px);

  background: ${props =>
    props.$isEvenRow === undefined
      ? 'transparent'
      : props.theme.color(props.$isEvenRow ? 'white' : 'neutral.200')};

  th,
  td {
    text-align: left;
    padding-right: 10px;
  }

  th {
    font-weight: bold;
  }

  th:first-child,
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
