import { Meta, StoryObj } from '@storybook/react';

import { ReadmeDecorator } from '@weco/cardigan/config/decorators';
import { themeValues } from '@weco/common/views/themes/config';
import MoreLink from '@weco/content/views/components/MoreLink';
import Readme from '@weco/content/views/components/MoreLink/README.mdx';

const meta: Meta<typeof MoreLink> = {
  title: 'Components/MoreLink',
  component: MoreLink,
  args: {
    url: '#',
    name: 'View all exhibitions',
  },
  argTypes: {
    url: { table: { disable: true } },
    ariaLabel: { table: { disable: true } },
    colors: {
      control: 'select',
      options: Object.keys(themeValues.buttonColors),
    },
  },
};

export default meta;

type Story = StoryObj<typeof MoreLink>;

export const Basic: Story = {
  name: 'MoreLink',
  render: args => {
    const { colors, ...rest } = args;

    return (
      <ReadmeDecorator
        WrappedComponent={MoreLink}
        args={{
          ...rest,
          ...(colors && {
            colors: themeValues.buttonColors[colors as unknown as string],
          }),
        }}
        Readme={Readme}
      />
    );
  },
};
