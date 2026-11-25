import { DocsContainer } from '@storybook/addon-docs/blocks';

import { ContextDecorator } from '@weco/cardigan/config/decorators';
import { AppContextProvider } from '@weco/common/contexts/AppContext';
import ConditionalWrapper from '@weco/common/views/components/ConditionalWrapper';
import GlobalSvgDefinitions from '@weco/common/views/components/GlobalSvgDefinitions';
import { Container } from '@weco/common/views/components/styled/Container';
import { Grid, GridCell } from '@weco/common/views/components/styled/Grid';
import theme from '@weco/common/views/themes/default';

import { allModes } from './modes';
import wellcomeTheme from './wellcome-theme';

// Docs pages don't go through decorators, so they need the theme here too
const ThemedDocsContainer = ({ children, context }) => (
  <DocsContainer context={context}>
    <ContextDecorator>{children}</ContextDecorator>
  </DocsContainer>
);

export const decorators = [
  (Story, context) => {
    return (
      <ContextDecorator>
        <AppContextProvider>
          <GlobalSvgDefinitions />
          <ConditionalWrapper
            condition={context?.parameters?.gridSizes}
            wrapper={children => (
              <Container>
                <Grid>
                  <GridCell $sizeMap={context.parameters.gridSizes}>
                    {children}
                  </GridCell>
                </Grid>
              </Container>
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
        [
          'Banners',
          'Buttons',
          ['Basics', 'Alternates'],
          'Cards',
          'Images',
          'Inputs',
          'Links',
          'Media',
          'Modals',
          'Tags',
        ],
        'To be made reusable',

        'Global',
      ],
    },
  },
  backgrounds: {
    grid: {
      disable: true,
    },
  },

  docs: {
    theme: wellcomeTheme,
    container: ThemedDocsContainer,
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
    modes: allModes,
  },
  actions: { disable: true },
  interactions: { disable: true },
};
