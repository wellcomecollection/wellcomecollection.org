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

// Visual 3-column (Name/Reference/Level) layout on desktop, but stacks into a single column on mobile.
// Below `sm` there's no room for 3 columns, so rows stack into a vertical flex column instead (order below controls the stack order).
// The column grid only applies from `sm` up.
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

// The "Show N more rows" control + results summary below the tree. Always
// 2 cells (unlike ContentsRow's 3 Name/Reference/Level), so it's its own
// component rather than reusing ContentsRow's nth-child-based rules
export const ContentsFooterRow = styled.div.attrs({
  className: typography('body', 'sm', 'regular'),
})`
  display: flex;
  flex-direction: column-reverse;
  ${props => props.theme.makeSpacePropertyValues('xs', ['row-gap'])}

  margin-left: -10px;
  width: calc(100% + 10px);

  > * {
    padding: 0 10px;
  }

  /* column-reverse flips what's on screen but not which DOM child
     :first-/:last-child match, so the visually-first cell (the summary
     text, last in the DOM) gets the top padding and vice versa - together
     they read as one padded block rather than adding space between the two. */
  > *:last-child {
    ${props => props.theme.makeSpacePropertyValues('sm', ['padding-top'])}
  }

  > *:first-child {
    ${props => props.theme.makeSpacePropertyValues('xs', ['padding-bottom'])}
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

      > *:first-child {
        padding-left: 10px;
      }
    `)}
`;

export const ContentsRowSummaryCell = styled.span`
  display: block;
  color: ${props => props.theme.color('neutral.600')};
  padding-left: ${props => 10 + nameCellTextIndent(props.theme.spacingUnit)}px;

  ${props =>
    props.theme.media('sm')(`
      color: inherit;
      padding-left: 0;
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
  color: inherit;
  gap: ${props => props.theme.spacingUnit}px;

  /* Removes the browser's default button padding, so the icon's left
     edge lands exactly where ContentsRowSummaryCell's padding-left
     expects it (nameCellTextIndent, past ChevronSpacer's width). */
  padding: 0;

  &:focus,
  &:hover {
    text-decoration: underline;
  }

  &:disabled {
    cursor: default;
    text-decoration: none;
  }
`;
