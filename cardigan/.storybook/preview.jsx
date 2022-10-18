import { default as React, Fragment } from 'react';
import theme from '../../common/views/themes/default';
import { ContextDecorator } from '../config/decorators';
import { grid } from '@weco/common/utils/classnames';
import ConditionalWrapper from '@weco/common/views/components/ConditionalWrapper/ConditionalWrapper';
import * as NextImage from "next/image";

const OriginalNextImage = NextImage.default;

Object.defineProperty(NextImage, "default", {
  configurable: true,
  value: (props) => <OriginalNextImage {...props} unoptimized />,
});

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
    storySort: {
      order: ['Cardigan', 'Components', 'Global', 'Documentation'],
    },
  },
  backgrounds: {
    values: themeColors,
    grid: {
      disable: true,
    },
  },
};
