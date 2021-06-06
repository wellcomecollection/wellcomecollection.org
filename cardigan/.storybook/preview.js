import { default as React, Fragment } from 'react';
import theme from '../../common/views/themes/default';
import { ContextDecorator } from '../config/decorators';
import wellcomeTheme from './wellcome-theme';
import { DocsContainer } from '@storybook/addon-docs/blocks';
import { grid } from '@weco/common/utils/classnames';
import ConditionalWrapper from '@weco/common/views/components/ConditionalWrapper/ConditionalWrapper';

export const decorators = [
  (Story, context) => {
    return (
      <ContextDecorator>
        <ConditionalWrapper
          condition={context?.parameters?.gridSizes}
          wrapper={children => (
            <div className={grid(context.parameters.gridSizes)}>{children}</div>
          )}
        >
          <Story {...context} />
        </ConditionalWrapper>
      </ContextDecorator>
    );
  },
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
