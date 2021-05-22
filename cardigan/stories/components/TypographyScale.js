import Table from '../../../common/views/components/Table/Table';
import { storiesOf } from '@storybook/react';
import { select } from '@storybook/addon-knobs';
import { fontSizesAtBreakpoints } from '../../../common/views/themes/typography';

const TypographyScaleExample = () => {
  const fontFamily = select(
    'Font family',
    ['Wellcome Bold Web Subset', 'HelveticaNeue-Medium', 'HelveticaNeue-Light'],
    'Wellcome Bold Web Subset'
  );
  const transpose = matrix => {
    let [row] = matrix;
    return row.map((value, column) => matrix.map(row => row[column]));
  };

  const cols = Object.entries(fontSizesAtBreakpoints).map(([key, value]) => {
    return Object.entries(value).map(([k, v], index) => {
      return (
        <span
          key={index}
          style={{ fontSize: `${v}px`, fontFamily: fontFamily }}
        >
          {v}px
        </span>
      );
    });
  });

  const rows = transpose(cols);
  const rowsWithScaleNumbers = rows.map((row, index) => {
    return [
      <strong key={index} style={{ fontSize: '22px' }}>
        {index}
      </strong>,
      ...row,
    ];
  });
  const firstRow = [[null, 'Small', 'Medium', 'Large']];
  const rowsWithHeadings = firstRow.concat(rowsWithScaleNumbers);

  return (
    <Table
      caption={'Typography scale'}
      hasRowHeaders={false}
      rows={rowsWithHeadings}
    />
  );
};

const stories = storiesOf('Global', module);
stories.add('Typography scale', TypographyScaleExample);
