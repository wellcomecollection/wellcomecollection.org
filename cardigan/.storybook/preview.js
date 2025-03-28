import { DocsContainer } from '@storybook/addon-docs';

import { ContextDecorator } from '@weco/cardigan/config/decorators';
import { AppContextProvider } from '@weco/common/views/components/AppContext/AppContext';
import ConditionalWrapper from '@weco/common/views/components/ConditionalWrapper/ConditionalWrapper';
import { GridCell } from '@weco/common/views/components/styled/GridCell';
import theme from '@weco/common/views/themes/default';

import wellcomeTheme from './wellcome-theme';

export const decorators = [
  (Story, context) => {
    return (
      <ContextDecorator>
        <AppContextProvider>
          <ConditionalWrapper
            condition={context?.parameters?.gridSizes}
            wrapper={children => (
              <div className="grid">
                <GridCell $sizeMap={context.parameters.gridSizes}>
                  {children}
                </GridCell>
              </div>
            )}
          >
            <Story {...context} />
          </ConditionalWrapper>
        </AppContextProvider>
      </ContextDecorator>
    );
  },
];

export const themeColors = Object.entries(theme.colors).map(([key, value]) => ({
  name: key,
  value,
}));

export const parameters = {
  options: {
    name: 'Cardigan',
    url: 'https://cardigan.wellcomecollection.org',
    storySort: {
      order: [
        'Cardigan',
        'Components',
        ['Banners', 'Buttons', ['Basics', 'Alternates'], 'Cards'],

        'Global',
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
};
