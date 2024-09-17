import { FunctionComponent, PropsWithChildren, ReactElement } from 'react';
import { ThemeProvider } from 'styled-components';

import {
  render,
  RenderResult,
  RenderOptions,
  MatcherFunction,
} from '@testing-library/react';
import theme from '@weco/common/views/themes/default';

const ProvidersWrapper: FunctionComponent<PropsWithChildren> = ({
  children,
}) => <ThemeProvider theme={theme}>{children}</ThemeProvider>;
export const renderWithTheme = (
  ui: ReactElement,
  options?: Omit<RenderOptions, 'wrapper'>
): RenderResult => render(ui, { wrapper: ProvidersWrapper, ...options });
type Query = (f: MatcherFunction) => HTMLElement;

// This helper function was adapted from here: https://stackoverflow.com/a/56859650
export const withMarkup = (query: Query, text: string) =>
  query((content: string, node: HTMLElement) => {
    const hasText = (node: HTMLElement) => node.textContent === text;
    const childrenDontHaveText = Array.from(node.children).every(
      child => !hasText(child as HTMLElement)
    );
    return hasText(node) && childrenDontHaveText;
  });
