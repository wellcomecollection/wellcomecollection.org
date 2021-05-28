import Table from '@weco/common/views/components/Table/Table';
import { fontSizesAtBreakpoints } from '@weco/common/views/themes/typography';
import styled from 'styled-components';
import { classNames, font } from '@weco/common/utils/classnames';

const Font = styled.div`
  padding: 10px 0 25px;
  border-bottom: 1px solid ${props => props.theme.color('silver')};
`;

const FontName = styled.h2.attrs({
  className: classNames({
    [font('hnm', 6)]: true,
  }),
})`
  color: ${props => props.theme.color('red')};
`;

const TypographyScale = ({ fontFamily }) => {
  const transpose = matrix => {
    const [row] = matrix;
    return row.map((value, column) => matrix.map(row => row[column]));
  };

  const cols = Object.entries(fontSizesAtBreakpoints).map(entry => {
    const value = entry[1];
    return Object.entries(value).map((e, index) => {
      const v = e[1];

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

  return <Table caption={null} hasRowHeaders={false} rows={rowsWithHeadings} />;
};

const sizes = [0, 1, 2, 3, 4, 5, 6];
const fontFamilies = ['wb', 'hnm', 'hnl', 'lr'];

const Typography = ({ text }) => {
  return (
    <div>
      {fontFamilies.map(font => (
        <div key={font}>
          {sizes.map(size => (
            <Font key={size}>
              <FontName>
                <code>
                  font-{font} font-size-{size}
                </code>
              </FontName>
              <p className={`no-margin font-size-${size} font-${font}`}>
                {text}
              </p>
            </Font>
          ))}
        </div>
      ))}
    </div>
  );
};

const Template = args => <Typography {...args} />;
export const families = Template.bind({});
families.args = {
  text: 'Wellcome Collection',
};

const ScaleTemplate = args => <TypographyScale {...args} />;
export const scale = ScaleTemplate.bind({});
scale.args = {
  fontFamily: 'Wellcome Bold Web',
};
