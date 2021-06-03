import { default as React, Fragment } from 'react';
import { addDecorator } from '@storybook/react';
import { withKnobs } from '@storybook/addon-knobs';
import theme, { GlobalStyle } from '../../common/views/themes/default';
import { addReadme } from 'storybook-readme';
import { ContextDecorator } from '../config/decorators';
import wellcomeTheme from './wellcome-theme';
import { DocsContainer } from '@storybook/addon-docs/blocks';

addDecorator(addReadme);
addDecorator(withKnobs);

export const decorators = [
  Story => (
    <ContextDecorator>
      <Story />
    </ContextDecorator>
  ),
];

const themeColors = Object.entries(theme.colors).map(([key, value]) => ({
  name: key,
  value: value.base,
}));

export const parameters = {
  options: {
    name: 'Cardigan',
    url: 'https://cardigan.wellcomecollection.org',
  },
  backgrounds: {
    values: themeColors,
  },
  docs: {
    theme: wellcomeTheme,
    container: ({ children, context }) => (
      <DocsContainer context={context}>
        <ContextDecorator>{children}</ContextDecorator>
      </DocsContainer>
    ),
  },
};
