import { render, RenderOptions, RenderResult } from '@testing-library/react';
import { FunctionComponent, PropsWithChildren, ReactElement } from 'react';
import { ThemeProvider } from 'styled-components';

import theme from '@weco/common/views/themes/default';

const AllTheProviders: FunctionComponent<PropsWithChildren> = ({
  children,
}) => {
  return <ThemeProvider theme={theme}>{children}</ThemeProvider>;
};

const customRender = (
  ui: ReactElement,
  options?: Omit<RenderOptions, 'queries'>
): RenderResult => render(ui, { wrapper: AllTheProviders, ...options });

// We have to disable eslint here as we're overriding the rener method
// eslint-disable-next-line import/export
export * from '@testing-library/react';

// eslint-disable-next-line import/export
export { customRender as render };
