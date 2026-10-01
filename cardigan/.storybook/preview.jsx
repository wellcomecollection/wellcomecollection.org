import { DocsContainer } from '@storybook/addon-docs/blocks';
import { useEffect, useState } from 'react';
import { GLOBALS_UPDATED } from 'storybook/internal/core-events';

import { ContextDecorator } from '@weco/cardigan/config/decorators';
import { AppContextProvider } from '@weco/common/contexts/AppContext';
import ConditionalWrapper from '@weco/common/views/components/ConditionalWrapper';
import GlobalSvgDefinitions from '@weco/common/views/components/GlobalSvgDefinitions';
import { Container } from '@weco/common/views/components/styled/Container';
import { Grid, GridCell } from '@weco/common/views/components/styled/Grid';
import theme from '@weco/common/views/themes/default';

import wellcomeTheme from './wellcome-theme';

// Docs pages don't go through decorators, so follow the toolbar here instead
const BrandUpdateDocsContainer = ({ children, context }) => {
  const [globals, setGlobals] = useState(
    () => context.store?.userGlobals?.get() ?? {}
  );

  useEffect(() => {
    const onGlobalsUpdated = ({ globals }) => setGlobals(globals);
    context.channel.on(GLOBALS_UPDATED, onGlobalsUpdated);
    return () => context.channel.off(GLOBALS_UPDATED, onGlobalsUpdated);
  }, [context.channel]);

  return (
    <DocsContainer context={context}>
      <ContextDecorator brandUpdate={globals.brandUpdate === 'on'}>
        {children}
      </ContextDecorator>
    </DocsContainer>
  );
};

export const decorators = [
  (Story, context) => {
    return (
      <ContextDecorator brandUpdate={context.globals.brandUpdate === 'on'}>
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

// Mirrors the brandUpdate toggle, so stories can be viewed in the new brand
export const globalTypes = {
  brandUpdate: {
    description: 'Brand update toggle',
    toolbar: {
      title: 'Brand',
      icon: 'paintbrush',
      items: [
        { value: 'off', title: 'Current brand' },
        { value: 'on', title: 'Brand update' },
      ],
      dynamicTitle: true,
    },
  },
};

export const initialGlobals = {
  brandUpdate: 'off',
};

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
    container: BrandUpdateDocsContainer,
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
  actions: { disable: true },
  interactions: { disable: true },
};
