import { ReactNode } from 'react';
import styled, { ThemeProvider } from 'styled-components';

import * as icons from '@weco/common/icons';
import { typography } from '@weco/common/utils/classnames';
import Icon from '@weco/common/views/components/Icon';
import { brandIcons } from '@weco/common/views/components/Icon/Icon.brandIcons';
import { createTheme } from '@weco/common/views/themes/config';

const IconWrapper = styled.div`
  display: inline-block;
  margin: 0 10px 20px;
  text-align: center;
  width: 140px;

  .icon {
    max-width: 80px;
  }
`;

const IconId = styled.p.attrs({
  className: typography('caption', 'md', 'regular'),
})`
  hyphens: auto;
`;

export const Icons = () => (
  <div className="keep-font">
    {Object.keys(icons).map(key => (
      <IconWrapper key={key}>
        <Icon icon={icons[key]} />
        <IconId>{key}</IconId>
      </IconWrapper>
    ))}
  </div>
);

const legacyTheme = createTheme(false);
const brandTheme = createTheme(true);

const WithTheme = ({
  brand,
  children,
}: {
  brand: boolean;
  children: ReactNode;
}) => (
  <ThemeProvider theme={brand ? brandTheme : legacyTheme}>
    {children}
  </ThemeProvider>
);

const Table = styled.table.attrs({
  className: typography('body', 'sm', 'regular'),
})`
  border-collapse: collapse;

  th,
  td {
    padding: 8px 16px;
    text-align: left;
    vertical-align: middle;
    border-bottom: 1px solid #ddd;
  }
`;

// Both icons drawn on top of each other, so differences in size and padding
// show up as colour fringes
const Overlay = styled.span`
  position: relative;
  display: inline-block;
  width: 24px;
  height: 24px;
  outline: 1px dashed #bbb;

  .icon {
    position: absolute;
    inset: 0;
    mix-blend-mode: multiply;
  }

  .icon:first-child {
    color: #e0457b;
  }

  .icon:last-child {
    color: #2a9fd6;
  }
`;

const Large = styled.span`
  .icon {
    width: 72px;
    height: 72px;
  }
`;

export const BrandIconComparison = () => (
  <div className="keep-font">
    <Table>
      <thead>
        <tr>
          <th>Name</th>
          <th>Legacy</th>
          <th>Brand</th>
          <th>Overlay</th>
          <th>Legacy (large)</th>
          <th>Brand (large)</th>
          <th>In text</th>
        </tr>
      </thead>
      <tbody>
        {Object.keys(icons).map(key => {
          const icon = icons[key];
          const hasBrandIcon = brandIcons.has(icon);

          return (
            <tr key={key}>
              <td>
                <code>{key}</code>
              </td>
              <td>
                <WithTheme brand={false}>
                  <Icon icon={icon} />
                </WithTheme>
              </td>
              <td>
                {hasBrandIcon ? (
                  <WithTheme brand>
                    <Icon icon={icon} />
                  </WithTheme>
                ) : (
                  'No match yet'
                )}
              </td>
              <td>
                {hasBrandIcon && (
                  <Overlay>
                    <WithTheme brand={false}>
                      <Icon icon={icon} />
                    </WithTheme>
                    <WithTheme brand>
                      <Icon icon={icon} />
                    </WithTheme>
                  </Overlay>
                )}
              </td>
              <td>
                <Large>
                  <WithTheme brand={false}>
                    <Icon icon={icon} />
                  </WithTheme>
                </Large>
              </td>
              <td>
                {hasBrandIcon && (
                  <Large>
                    <WithTheme brand>
                      <Icon icon={icon} />
                    </WithTheme>
                  </Large>
                )}
              </td>
              <td>
                <WithTheme brand={false}>
                  <Icon icon={icon} matchText />
                </WithTheme>{' '}
                Legacy /{' '}
                {hasBrandIcon && (
                  <WithTheme brand>
                    <Icon icon={icon} matchText />
                  </WithTheme>
                )}{' '}
                Brand
              </td>
            </tr>
          );
        })}
      </tbody>
    </Table>
  </div>
);
