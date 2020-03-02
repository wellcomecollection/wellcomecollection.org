// @flow
import styled from 'styled-components';
import type { ComponentType } from 'react';

export type Props = {
  headings: string[],
};

const StyledTable: ComponentType<Props> = styled.table`
  width: 100%;
  border-collapse: collapse;

  /* Force table to not be like tables anymore */
  table,
  thead,
  tbody,
  th,
  td,
  tr {
    display: block;
    width: 100%;
  }

  /* Hide table headers (but not display: none;, for accessibility) */
  thead tr {
    position: absolute;
    top: -9999px;
    left: -9999px;
  }

  tr {
    margin-bottom: 24px;
  }

  th,
  td {
    min-width: 150px;
    text-align: left;
    font-weight: normal;
    padding-right: 30px;
  }

  td {
    /* Behave  like a "row" */
    border: none;
    position: relative;
    padding-left: 50%;
    margin-bottom: 6px;
  }

  td:before {
    /* Now like a table header */
    position: absolute;
    /* Top/left values mimic padding */
    top: 0;
    left: 0;
    width: 45%;
    white-space: nowrap;
    speak: none;
  }

  ${props =>
    props.headings.map(
      (heading, i) =>
        `td:nth-of-type(${i + 1}):before {
          content: '${heading}';
        }`
    )}

  ${props => props.theme.media.medium`
  display: table;
  width: auto;

  tr {
    display: table-row;
  }
  th,
  td {
    display: table-cell;
  }
  thead tr {
    position: static;
  }
  td {
    padding-left: 0;
  }
  td:before {
    content: ''!important;
  }
  `}
`;

export default StyledTable;
