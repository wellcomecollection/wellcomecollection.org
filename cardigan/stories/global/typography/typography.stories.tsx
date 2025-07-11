import { ReactElement } from 'react';
import styled from 'styled-components';

import { font } from '@weco/common/utils/classnames';
import { fontSizesAtBreakpoints } from '@weco/common/views/themes/typography';
import MoreLink from '@weco/content/views/components/MoreLink';
import Table from '@weco/content/views/components/Table';

const Font = styled.div`
  padding: 10px 0 25px;
  border-bottom: 1px solid ${props => props.theme.color('neutral.500')};
`;

const FontName = styled.h2.attrs({
  className: font('intb', 6),
})`
  color: ${props => props.theme.color('accent.purple')};
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
        <span key={index} style={{ fontSize: `${v}rem`, fontFamily }}>
          {v}rem ({v * 16}px)
        </span>
      );
    });
  });

  const rows = transpose(cols);
  const rowsWithScaleNumbers: (string | ReactElement)[][] = rows
    .map((row, index) => {
      return [
        <strong key={index} style={{ fontSize: '22px' }}>
          {index}
        </strong>,
        ...row,
      ];
    })
    .filter(Boolean);
  const firstRow: (string | ReactElement)[][] = [
    ['', 'Small', 'Medium', 'Large'],
  ];
  const rowsWithHeadings = firstRow.concat(rowsWithScaleNumbers);

  return <Table hasRowHeaders={false} rows={rowsWithHeadings} />;
};

const sizes = [0, 1, 2, 3, 4, 5, 6];
const fontFamilies = ['intr', 'intb', 'wb', 'lr'];

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
              <p
                className={`font-size-${size} font-${font}`}
                style={{ marginBottom: 0 }}
              >
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
  text: 'The quick brown fox jumped over the lazy dog',
};

const ScaleTemplate = args => <TypographyScale {...args} />;
export const scale = ScaleTemplate.bind({});
scale.args = {
  fontFamily: 'Wellcome Bold Web',
};

const MiscTemplate = () => (
  <>
    <div>
      <h2>More link</h2>
      <MoreLink name="Full event details" url="#" />
      <div className="spaced-text">
        <div></div>
        <div></div>
      </div>
    </div>
    <div className="spaced-text">
      <div>
        <h3>Usage</h3>
        <p>Used to indicate a link to more content of a similar theme/type.</p>
      </div>
      <div>
        <h2>Body text link</h2>
        <div className="body-text">
          <p style={{ marginBottom: 0 }}>
            There has even been a (failed){' '}
            <a href="https://www.nytimes.com/2015/10/15/us/court-rules-hot-yoga-isnt-entitled-to-copyright.html">
              attempt to copyright a yoga system
            </a>
            .
          </p>
        </div>
        <h3>Usage</h3>
        <p>
          Used in the main body copy. These are animated links which form part
          of the experience language. Uses border-bottom property for underline.
        </p>
      </div>
      <div>
        <h2>Plain text link</h2>
        <div>
          <p className="font-hnr4-s" style={{ marginBottom: 0 }}>
            Here is <a href="#">a link</a> in a block of non body text.
          </p>
        </div>
        <h3>Usage</h3>
        <p>
          Links that appear in blocks of copy that are not body text, should
          follow the same behaviour as the Secondary link (note, font
          family/size is inherited for plain text links). Examples where this
          happens are author descriptions and image captions.
        </p>
      </div>
    </div>
  </>
);
export const misc = MiscTemplate.bind({});

export default {
  title: 'Global/Typography',
};
