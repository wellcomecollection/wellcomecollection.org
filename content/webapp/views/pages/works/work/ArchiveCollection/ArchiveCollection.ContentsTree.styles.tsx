import styled from 'styled-components';

import { typography } from '@weco/common/utils/classnames';
import { compactControlDimensions } from '@weco/content/views/pages/works/work/work.helpers';

export {
  Tree,
  TreeBand,
  TreeInstructions,
} from '@weco/content/views/pages/works/work/work.styles';
export { compactControlDimensions } from '@weco/content/views/pages/works/work/work.helpers';

// Where the title text starts on mobile (chevron + gap, no icon - that's
// hidden there). Lets Reference/Level line up under the title.
const nameCellTextIndent = (spacingUnit: number) =>
  compactControlDimensions.controlSize + spacingUnit;

// Each row's its own <table> (real tables can't nest recursively), so
// nth-child can't stripe them - $isEvenRow does that instead, from
// visible-row position (see `rowIndexById`). $indentPx cancels out the
// ancestor <ul> indentation so the stripe spans full width at any depth,
// then reapplies it as padding so content doesn't shift.
//
// Below `sm` cells stack into a vertical block instead of 3 columns (no
// room for those on mobile) - header's hidden too since it stops making
// sense once things are stacked. `sm` and up restores the normal table.
export const ContentsTable = styled.table.attrs({
  className: typography('body', 'sm', 'regular'),
})<{ $isEvenRow?: boolean; $indentPx?: number; $hasControl?: boolean }>`
  border-collapse: collapse;

  /* Needed at every width, not just desktop - with 'auto' layout a long
     nowrap title just pushes the table wider instead of truncating. */
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

  thead {
    display: none;
  }

  tbody tr {
    display: flex;
    flex-direction: column;
  }

  td {
    display: block;

    /* All cells need this, not just the first - the table's shifted
       left by $indentPx (see margin-left above), so without it a cell
       would render flush against the page edge. */
    padding: 0 10px 0 ${props => props.$indentPx ?? 0}px;
  }

  td:not(:first-child) {
    color: ${props => props.theme.color('neutral.600')};
    padding-left: ${props =>
      (props.$indentPx ?? 0) + nameCellTextIndent(props.theme.spacingUnit)}px;
  }

  /* Vertical padding only goes on the visually first/last cells (Name,
     Reference), so the stack reads as one padded row rather than adding
     space between every line. Can't put it on ContentsTable/tr instead -
     browsers ignore padding on table/table-row once border-collapse:
     collapse is set, and tr's a real table-row again at 'sm' anyway. */
  td:nth-child(1) {
    ${props => props.theme.makeSpacePropertyValues('xs', ['padding-top'])}
  }

  /* Mobile order is Name, Level, Reference (matching the design) - 'order'
     only affects flex items, so it's a no-op once 'sm' switches back to
     table-cell below and the desktop columns stay Name/Reference/Level. */
  td:nth-child(2) {
    order: 2;
    ${props => props.theme.makeSpacePropertyValues('xs', ['padding-bottom'])}
  }

  td:nth-child(3) {
    order: 1;
  }

  ${props =>
    props.theme.media('sm')(`
      thead {
        display: table-header-group;
      }

      tbody tr {
        display: table-row;
      }

      td {
        display: table-cell;
        padding-right: 10px;
        padding-left: 0;
        ${props.theme.makeSpacePropertyValues('xs', [
          'padding-top',
          'padding-bottom',
        ])}
      }

      /* Only the first column needs the tree's indentation here - the
         rest are separate columns starting fresh after it. */
      td:first-child {
        padding-left: ${props.$indentPx ?? 0}px;
      }

      /* Undoes the base td:not(:first-child) rule's left padding, which
         is only for lining cells up under the title on mobile. */
      td:not(:first-child) {
        color: inherit;
        padding-left: 0;
      }

      th {
        padding: 12px 10px 12px 0;
        font-weight: bold;
      }

      /* No ancestor <ul> to line up with here (it's a plain header, not
         part of the tree), so a fixed padding instead of $indentPx. */
      th:first-child {
        padding-left: 10px;
      }

      th:nth-child(2),
      td:nth-child(2) {
        width: 160px;
      }

      th:nth-child(3),
      td:nth-child(3) {
        width: 110px;
      }
    `)}
`;

// Level gets its own type icon on mobile (matching the design). Desktop
// already has a Name icon plus a "Level" header, so it's hidden there.
export const LevelCell = styled.span`
  display: inline-flex;
  align-items: center;
  gap: ${props => props.theme.spacingUnit}px;

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
  width: ${compactControlDimensions.controlSize}px;
  height: ${compactControlDimensions.controlSize}px;
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
