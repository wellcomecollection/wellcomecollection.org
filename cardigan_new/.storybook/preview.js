import { default as React } from 'react';
import { RouterContext } from 'next/dist/shared/lib/router-context';
import { DocsContainer } from '@storybook/addon-docs';
import theme from '@weco/common/views/themes/default';
import { ContextDecorator } from '@weco/cardigan/config/decorators';
import wellcomeTheme from './wellcome-theme';
import { grid } from '@weco/common/utils/classnames';
import ConditionalWrapper from '@weco/common/views/components/ConditionalWrapper/ConditionalWrapper';
import { AppContextProvider } from '@weco/common/views/components/AppContext/AppContext';

export const decorators = [
  (Story, context) => {
    return (
      <ContextDecorator>
        <AppContextProvider>
        <ConditionalWrapper
          condition={context?.parameters?.gridSizes}
          wrapper={children => (
            <div className={grid(context.parameters.gridSizes)}>{children}</div>
          )}
        >
          <Story {...context} />
        </ConditionalWrapper>
        </AppContextProvider>
      </ContextDecorator>
    );
  },
];

const themeColors = Object.entries(theme.colors).map(([key, value]) => ({
  name: key,
  value: value,
}));

export const parameters = {
  options: {
    name: 'Cardigan',
    url: 'https://cardigan.wellcomecollection.org',
    storySort: {
      order: [
        'Cardigan',
        'Components',
        [
          'Buttons',
            [
              'Basics',
              'Alternates',
            ],
          'Cards',
        ],

        'Global'
      ],
    },
  },
  backgrounds: {
    values: themeColors,
    grid: {
      disable: true,
    },
  },
  previewTabs: {
    canvas: { hidden: true },
    'storybook/docs/panel': { hidden: true },
  },
  docs: {
    theme: wellcomeTheme,
    container: ({ children, context }) => (
      <DocsContainer context={context}>
        <ContextDecorator>{children}</ContextDecorator>
      </DocsContainer>
    ),
  },
  a11y: {
    config: {
      rules: [
        {
          id: 'color-contrast',
          selector: '*:not(#readme)',
        },
      ],
    },
  },
  chromatic: {
    viewports: [375, 1200],
  },
  nextRouter: {
    Provider: RouterContext.Provider,
  },
};
