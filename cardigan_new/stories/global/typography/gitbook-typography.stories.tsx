import { fontSizesAtBreakpoints } from '@weco/common/views/themes/typography';
import Table from '@weco/content/components/Table';

const TypographyScaleSimple = () => {
  const transpose = matrix => {
    const [row] = matrix;
    return row.map((_, column) => matrix.map(row => row[column]));
  };

  const cols = Object.entries(fontSizesAtBreakpoints)
    .map(entry => {
      const value = entry[1];
      return Object.entries(value).map((e, index) => {
        const v = e[1];

        return (
          <span key={index}>
            {v * 16} / {+(v * 16 * 1.5).toFixed(2)}
          </span>
        );
      });
    })
    .reverse();

  const rows = transpose(cols);
  const rowsWithScaleNumbers = rows.map((row, index) => {
    return [<span key={index}>{index}</span>, ...row];
  });
  const firstRow = [['Font size unit', 'BP Large', 'BP Medium', 'BP Small']];
  const rowsWithHeadings = firstRow.concat(rowsWithScaleNumbers);

  return <Table hasRowHeaders={false} rows={rowsWithHeadings} />;
};

const Template = () => <TypographyScaleSimple />;
export const Basic = {
  name: 'Simple scale',
  render: Template,
};

export default {
  title: 'GitBook/Typography',
};
