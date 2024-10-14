import { themeValues } from '@weco/common/views/themes/config';
import Table from '@weco/content/components/Table';

const { spaceAtBreakpoints } = themeValues;

const SpacingScale = () => {
  const transpose = matrix => {
    const [row] = matrix;
    return row.map((_, column) => matrix.map(row => row[column])).reverse();
  };

  const cols = Object.entries(spaceAtBreakpoints)
    .map(entry => {
      const value = entry[1];
      return Object.entries(value).map((e, index) => {
        const v = e[1];

        return <span key={index}>{v}</span>;
      });
    })
    .reverse();

  const rows = transpose(cols);
  const rowsWithScaleColumn = rows.map((row, index) => {
    return [
      <span key={index}>
        {
          {
            0: 'XL',
            1: 'L',
            2: 'M',
            3: 'S',
            4: 'XS',
          }[index]
        }
      </span>,
      ...row,
    ];
  });
  const firstRow = [['Size', 'BP Large', 'BP Medium', 'BP Small']];
  const rowsWithHeadings = firstRow.concat(rowsWithScaleColumn);

  return <Table hasRowHeaders={false} rows={rowsWithHeadings} />;
};

const ScaleTemplate = () => <SpacingScale />;

export const Basic = {
  name: 'Scale',
  render: ScaleTemplate,
};

export default {
  title: 'GitBook/Spacing',
};
