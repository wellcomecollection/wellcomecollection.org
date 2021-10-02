import styled from 'styled-components';
import Space from '../styled/Space';
import { font, classNames } from '../../../utils/classnames';

const StyledTable = styled.table.attrs({
  className: classNames({
    [font('hnr', 5)]: true,
  }),
})`
   {
    table-layout: ${props => (props.useFixedWidth ? 'fixed' : 'auto')};
    width: 100%;
    border-collapse: collapse;
  }

  @media (max-width: ${props =>
      props.maxWidth ? props.maxWidth : props.theme.sizes.large}px) {
    display: block;

    thead,
    tbody,
    th,
    td,
    tr {
      display: block;
    }
    thead {
      // hidden visually, but still available to screen readers
      overflow: hidden;
      position: relative;
    }
    thead tr {
      position: absolute;
    }
  }
`;

const StyledTr = styled(Space).attrs({
  as: 'tr',
})`
  border-bottom: 1px solid ${props => props.theme.color('pumice')};

  &:last-of-type {
    border: none;
  }
`;

const StyledTh = styled(Space).attrs(props => ({
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
  className: classNames({
    [font('hnb', 5)]: true,
  }),
}))`
  background: ${props =>
    props.plain
      ? props.theme.color('transparent')
      : props.theme.color('pumice')};
  white-space: nowrap;
  text-align: left;
  vertical-align: top;
  @media (max-width: ${props =>
      props.maxWidth ? props.maxWidth : props.theme.sizes.large}px) {
    padding-left: 0;
  }
`;

const StyledTd = styled(Space).attrs(props => ({
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
}))`
  text-align: left;
  vertical-align: top;
  @media (max-width: ${props =>
      props.maxWidth ? props.maxWidth : props.theme.sizes.large}px) {
    padding-left: 0;
    padding-top: 0;
    padding-bottom: ${props => `${props.theme.spacingUnit}px`};
    &:first-of-type {
      padding-top: ${props => `${props.theme.spacingUnit * 2}px`};
    }
    &:last-of-type {
      padding-bottom: ${props => `${props.theme.spacingUnit * 3}px`};
    }
    :before {
      display: block;
      white-space: nowrap;
      content: ${props => (props.content ? `'${props.content}'` : '')};
      font-weight: bold;
    }
  }
`;

type Props = {
  rows: (string | ReactElement)[][],
  caption?: string,
  plain?: boolean,
  maxWidth?: number,
  columnWidths?: (number | null)[],
};

const StackingTable: FunctionComponent<Props> = ({
  rows,
  caption,
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
            {row.map((data, index) => (
              <StyledTd
                key={index}
                content={headerRow[index]}
                plain={plain}
                maxWidth={maxWidth}
              >
                {data}
              </StyledTd>
            ))}
          </StyledTr>
        ))}
      </tbody>
    </StyledTable>
  );
};

export default StackingTable;
