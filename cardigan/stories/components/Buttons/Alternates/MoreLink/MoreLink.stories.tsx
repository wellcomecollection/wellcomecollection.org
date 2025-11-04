import { Meta, StoryObj } from '@storybook/react';
import { FunctionComponent } from 'react';
import { useTheme } from 'styled-components';

import { ReadmeDecorator } from '@weco/cardigan/config/decorators';
import theme from '@weco/common/views/themes/default';
import MoreLink from '@weco/content/views/components/MoreLink';
import Readme from '@weco/content/views/components/MoreLink/README.mdx';

type MoreLinkStoryProps = React.ComponentProps<typeof MoreLink> & {
  colors?: string;
};

const meta: Meta<typeof MoreLink> = {
  title: 'Components/Buttons/Alternates/MoreLink',
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
      options: Object.keys(theme.buttonColors),
    },
  },
};

export default meta;

type Story = StoryObj<MoreLinkStoryProps>;

const MoreLinkStory: FunctionComponent<MoreLinkStoryProps> = args => {
  const { colors, ...rest } = args;
  const theme = useTheme();

  return (
    <ReadmeDecorator
      WrappedComponent={MoreLink}
      args={{
        ...rest,
        ...(colors && {
          colors: theme.buttonColors[colors as keyof typeof theme.buttonColors],
        }),
      }}
      Readme={Readme}
    />
  );
};

export const Basic: Story = {
  name: 'MoreLink',
  render: args => <MoreLinkStory {...args} />,
};
