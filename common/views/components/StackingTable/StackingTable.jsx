import styled from 'styled-components';
import Space from '../styled/Space';
import { font, classNames } from '../../../utils/classnames';

const StyledTable = styled.table.attrs({
  className: classNames({
    [font('hnr', 5)]: true,
  }),
})`
   {
    width: 100%;
    border-collapse: collapse;
    text-align: left;
  }

  @media (max-width: ${props => props.theme.sizes.large}px) {
    table,
    thead,
    tbody,
    th,
    td,
    tr {
      display: block;
    }
    thead {
      // TODO check styling across browsers
      // hidden visually, but still available to screen readers
      overflow: hidden;
      position: relative;
    }
    thead tr {
      position: absolute;
    }
    tr {
      border-bottom: 1px solid ${props => props.theme.color('pumice')};
    }
    tr:last-of-type {
      border: none;
    }
  }
`;

const StyledTh = styled(Space).attrs({
  as: 'th',
  v: { size: 's', properties: ['padding-top', 'padding-bottom'] },
  h: { size: 'm', properties: ['padding-left', 'padding-right'] },
  className: classNames({
    [font('hnb', 5)]: true,
  }),
})`
  background: ${props => props.theme.color('pumice')};
  white-space: nowrap;
`;

const StyledTd = styled(Space).attrs({
  as: 'td',
  v: { size: 's', properties: ['padding-top', 'padding-bottom'] },
  h: { size: 'm', properties: ['padding-left', 'padding-right'] },
})`
  @media (max-width: ${props => props.theme.sizes.large}px) {
    :before {
      display: block;
      white-space: nowrap;
      content: ${props => `'${props.content}'`};
      font-weight: bold;
    }
  }
`;

type Props = {
  rows: string[],
  caption: string,
};

const StackingTable: FunctionComponent<Props> = ({
  rows,
  caption,
}: Props): ReactElement<Props> => {
  const headerRow = rows[0];
  const bodyRows = rows.slice(1);
  return (
    <StyledTable>
      <thead>
        <tr>
          {headerRow.map((data, index) => (
            <StyledTh key={index}>{data}</StyledTh>
          ))}
        </tr>
      </thead>
      <tbody>
        {bodyRows.map((row, index) => (
          <tr key={index}>
            {row.map((data, index) => (
              <StyledTd key={index} content={`${headerRow[index]}`}>
                {data}
              </StyledTd>
            ))}
          </tr>
        ))}
      </tbody>
    </StyledTable>
  );
};

export default StackingTable;
