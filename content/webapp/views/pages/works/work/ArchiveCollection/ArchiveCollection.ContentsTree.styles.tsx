import styled from 'styled-components';

import { typography } from '@weco/common/utils/classnames';
import { compactControlDimensions } from '@weco/content/views/pages/works/work/work.helpers';
import {
  Tree,
  TreeBand,
  TreeInstructions,
} from '@weco/content/views/pages/works/work/work.styles';

export { Tree, TreeBand, TreeInstructions };
export { compactControlDimensions } from '@weco/content/views/pages/works/work/work.helpers';

// Where the title text starts on mobile (chevron + gap, no icon - that's
// hidden there). Lets Reference/Level line up under the title.
const nameCellTextIndent = (spacingUnit: number) =>
  compactControlDimensions.controlWidth + spacingUnit;

// Visual 3-column (Name/Reference/Level) layout only - this isn't real
// tabular data, so it's plain divs on a grid rather than a <table>. The
// tree's actual structure/semantics (hierarchy, level, position, name)
// live on the ARIA tree in NestedList (role="tree"/"treeitem"/"group",
// aria-level/-posinset/-setsize, aria-label via getAriaLabel) - a <table>
// nested inside a role="treeitem" isn't a recognised ARIA pattern, and
// previously each row rendered its own disconnected single-row <table>
// with no <th> to associate back to the (separate) header table anyway.
//
// Below `sm` there's no room for 3 columns, so rows stack into a vertical
// flex column instead (order below controls the stack order) - the
// column-grid only applies from `sm` up.
const contentsGridColumns = '1fr 160px 110px';

export const ContentsRow = styled.div.attrs({
  className: typography('body', 'sm', 'regular'),
})<{ $isEvenRow?: boolean; $indentPx?: number; $hasControl?: boolean }>`
  display: flex;
  flex-direction: column;

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

  > * {
    text-align: left;

    /* All cells need this, not just the first - the row's shifted
       left by $indentPx (see margin-left above), so without it a cell
       would render flush against the page edge. */
    padding: 0 10px 0 ${props => props.$indentPx ?? 0}px;
  }

  > *:not(:first-child) {
    color: ${props => props.theme.color('neutral.600')};
    padding-left: ${props =>
      (props.$indentPx ?? 0) + nameCellTextIndent(props.theme.spacingUnit)}px;
  }

  ${TreeBand} & > *:not(:first-child) {
    color: inherit;
  }

  /* Vertical padding only goes on the visually first/last cells (Name,
     Reference), so the stack reads as one padded row rather than adding
     space between every line. */
  > *:nth-child(1) {
    ${props => props.theme.makeSpacePropertyValues('xs', ['padding-top'])}
  }

  /* Mobile order is Name, Level, Reference (matching the design) - 'order'
     only affects flex items, so it's a no-op once 'sm' switches to grid
     below and the desktop columns stay Name/Reference/Level. */
  > *:nth-child(2) {
    order: 2;
    ${props => props.theme.makeSpacePropertyValues('xs', ['padding-bottom'])}
  }

  > *:nth-child(3) {
    order: 1;
  }

  ${props =>
    props.theme.media('sm')(`
      display: grid;
      grid-template-columns: ${contentsGridColumns};
      column-gap: 10px;

      > * {
        padding: 0;
        ${props.theme.makeSpacePropertyValues('xs', [
          'padding-top',
          'padding-bottom',
        ])}
      }

      /* Resets the mobile-only reordering above - needs the same
         nth-child specificity as those rules, a bare '> *' loses to them. */
      > *:nth-child(2),
      > *:nth-child(3) {
        order: initial;
      }

      /* Only the first column needs the tree's indentation here - the
         rest are separate columns starting fresh after it. */
      > *:first-child {
        padding-left: ${props.$indentPx ?? 0}px;
      }

      /* Undoes the base rule's left padding above, which is only for
         lining cells up under the title on mobile. */
      > *:not(:first-child) {
        color: inherit;
        padding-left: 0;
      }
    `)}
`;

// The column headings shown above the tree. Purely decorative (the
// TreeBand wrapping it is aria-hidden) - real column labels are already
// part of each row's aria-label - so hidden below `sm` entirely rather
// than stacking, same as the data it's labelling.
export const ContentsHeaderRow = styled.div.attrs({
  className: typography('body', 'sm', 'regular'),
})`
  display: none;

  ${props =>
    props.theme.media('sm')(`
      display: grid;
      grid-template-columns: ${contentsGridColumns};
      column-gap: 10px;

      > * {
        padding: 12px 0;
        font-weight: bold;
        text-align: left;
      }

      /* No ancestor <ul> to line up with here (it's a plain header, not
         part of the tree), so a fixed padding instead of $indentPx. */
      > *:first-child {
        padding-left: 10px;
      }
    `)}
`;

// Merges the "Showing X of Y rows" cell across the Reference/Level
// columns (the old colSpan={2}) - a no-op below `sm`, where ContentsRow
// isn't a grid yet and this is just the next stacked block.
export const ContentsRowSummaryCell = styled.span`
  ${props =>
    props.theme.media('sm')(`
      grid-column: 2 / span 2;
      display: flex;
      align-items: center;
      justify-content: flex-end;
      text-align: right;
      padding-right: ${compactControlDimensions.controlWidth}px;
    `)}
`;

// Level gets its own type icon on mobile (matching the design). Desktop
// already has a Name icon plus a "Level" header, so it's hidden there.
export const LevelCell = styled.span`
  display: inline-flex;
  align-items: center;
  gap: ${props => props.theme.spacingUnit}px;
  vertical-align: middle;

  ${props =>
    props.theme.media('sm')(`
      .icon {
        display: none;
      }
    `)}
`;

export const NameCell = styled.span`
  display: inline-flex;
  align-items: center;
  gap: ${props => props.theme.spacingUnit}px;
  min-width: 0;
  max-width: 100%;
  vertical-align: middle;

  .icon {
    flex: 0 0 auto;
  }

  /* > targets just the folder/file icon, not the chevron nested inside
     TreeControl - that one has to stay, it's the expand/collapse control.
     The folder/file icon's redundant now LevelCell has its own, so it's
     hidden below 'sm'. */
  > .icon {
    display: none;

    ${props =>
      props.theme.media('sm')(`
        display: inline-block;
      `)}
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
  width: ${compactControlDimensions.controlWidth}px;
  height: ${compactControlDimensions.controlHeight}px;
`;

export const ShowMoreButton = styled.button.attrs({
  type: 'button',
  className: typography('body', 'sm', 'regular'),
})`
  display: inline-flex;
  align-items: center;
  color: ${props => props.theme.color('neutral.600')};
  gap: ${props => props.theme.spacingUnit}px;

  ${props =>
    props.theme.media('sm')(`
      color: inherit;
    `)}

  &:focus,
  &:hover {
    text-decoration: underline;
  }

  &:disabled {
    cursor: default;
    text-decoration: none;
  }
`;
