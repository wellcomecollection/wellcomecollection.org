import styled from 'styled-components';
import Space from '@weco/common/views/components/styled/Space';
import { font } from '@weco/common/utils/classnames';
import { fontFamilyMixin } from '../../themes/typography';
import { ReactElement, FunctionComponent, ReactNode } from 'react';

type TableProps = {
  useFixedWidth: boolean;
  maxWidth?: number;
};

const StyledTable = styled.table.attrs({
  className: font('intr', 5),
})<TableProps>`
  table-layout: ${props => (props.useFixedWidth ? 'fixed' : 'auto')};
  width: 100%;
  border-collapse: collapse;

  @media (max-width: ${props => props.maxWidth || props.theme.sizes.large}px) {
    display: block;

    thead,
    tbody,
    th,
    td,
    tr {
      display: block;
    }

    thead {
      /* hidden visually, but still available to screen readers */
      overflow: hidden;
      position: relative;
    }

    thead tr {
      position: absolute;
    }
  }
`;

type TrProps = {
  plain?: boolean;
};

const StyledTr = styled(Space).attrs({
  as: 'tr',
})<TrProps>`
  border-bottom: 1px solid ${props => props.theme.color('warmNeutral.400')};

  &:last-of-type {
    border: none;
  }
`;

type ThProps = {
  plain?: boolean;
  maxWidth?: number;
  key?: number;
  width?: number;
};

const StyledTh = styled(Space).attrs<ThProps>(props => ({
  as: 'th',
  v: {
    size: 's',
    properties: props.plain ? [] : ['padding-top', 'padding-bottom'],
  },
  h: {
    size: 'm',
    properties: [props.plain ? '' : 'padding-left', 'padding-right'].filter(
      Boolean
    ),
  },
  className: font('intb', 5),
}))<ThProps>`
  background: ${props =>
    props.plain ? 'transparent' : props.theme.color('warmNeutral.400')};
  white-space: nowrap;
  text-align: left;
  vertical-align: top;

  @media (max-width: ${props => props.maxWidth || props.theme.sizes.large}px) {
    padding-left: 0;
  }
`;

type TdProps = {
  plain?: boolean;
  maxWidth?: number;
  cellContent?: ReactNode;
  key?: number;
};

const StyledTd = styled(Space).attrs<TdProps>(props => ({
  as: 'td',
  v: {
    size: 'm',
    properties: props.plain ? [] : ['padding-top', 'padding-bottom'],
  },
  h: {
    size: 'm',
    properties: [props.plain ? '' : 'padding-left', 'padding-right'].filter(
      Boolean
    ),
  },
}))<TdProps>`
  text-align: left;
  vertical-align: top;

  @media (max-width: ${props => props.maxWidth || props.theme.sizes.large}px) {
    padding-left: 0;
    padding-top: 0;
    padding-bottom: ${props => `${props.theme.spacingUnit}px`};

    &:first-of-type {
      padding-top: ${props => `${props.theme.spacingUnit * 2}px`};
    }

    &:last-of-type {
      padding-bottom: ${props => `${props.theme.spacingUnit * 3}px`};
    }

    &::before {
      display: block;
      white-space: nowrap;
      content: ${props => (props.cellContent ? `'${props.cellContent}'` : '')};
      ${fontFamilyMixin('intb', true)}
    }
  }
`;

type Props = {
  rows: ReactNode[][];
  plain?: boolean;
  maxWidth?: number;
  columnWidths?: (number | undefined)[];
};

const StackingTable: FunctionComponent<Props> = ({
  rows,
  plain,
  maxWidth,
  columnWidths = [],
}: Props): ReactElement<Props> => {
  const headerRow = rows[0];
  const bodyRows = rows.slice(1);

  return (
    <StyledTable maxWidth={maxWidth} useFixedWidth={columnWidths.length > 0}>
      <thead>
        <tr>
          {headerRow.map((data, index) => (
            <StyledTh
              key={index}
              plain={plain}
              maxWidth={maxWidth}
              width={columnWidths[index]}
            >
              {data}
            </StyledTh>
          ))}
        </tr>
      </thead>
      <tbody>
        {bodyRows.map((row, index) => (
          <StyledTr plain={plain} key={index}>
            {row.map((data, index) => {
              return (
                <StyledTd
                  key={index}
                  cellContent={headerRow[index]}
                  plain={plain}
                  maxWidth={maxWidth}
                >
                  {data}
                </StyledTd>
              );
            })}
          </StyledTr>
        ))}
      </tbody>
    </StyledTable>
  );
};

export default StackingTable;
