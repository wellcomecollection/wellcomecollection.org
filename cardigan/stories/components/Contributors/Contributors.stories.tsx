import { Meta, StoryObj } from '@storybook/react';
import { ComponentProps } from 'react';

import { ReadmeDecorator } from '@weco/cardigan/config/decorators';
import { organisation, person } from '@weco/cardigan/stories/data/content';
import Contributors from '@weco/content/views/components/Contributors';
import Readme from '@weco/content/views/components/Contributors/README.mdx';

// Extend the story type
type ContributorsStoryProps = ComponentProps<typeof Contributors> & {
  hasTitleOverride: boolean;
  hasPartnerAsRole: boolean;
};

const meta: Meta<ContributorsStoryProps> = {
  title: 'Components/Contributors',
  component: Contributors,
  args: {
    contributors: [
      {
        contributor: {
          ...person,
          type: 'people',
          id: 'xxx',
        },
        role: {
          id: 'xxx',
          title: 'Speaker',
        },
      },
    ],
    titlePrefix: 'About the',
    hasTitleOverride: false,
    titleOverride: 'Overridden title',
    hasPartnerAsRole: false,
  },
  argTypes: {
    hasTitleOverride: {
      name: 'Has title override',
    },
    titlePrefix: {
      name: 'Title prefix',
    },
    titleOverride: {
      table: {
        disable: true,
      },
    },
    hasPartnerAsRole: {
      name: 'One of the contributors is a "partner"',
    },
    contributors: {
      table: {
        disable: true,
      },
    },
  },
};

export default meta;

type Story = StoryObj<ContributorsStoryProps>;

export const Basic: Story = {
  name: 'Contributors',
  render: args => {
    const { hasTitleOverride, titleOverride, hasPartnerAsRole, ...rest } = args;

    return (
      <ReadmeDecorator
        WrappedComponent={Contributors}
        args={{
          titleOverride: hasTitleOverride ? titleOverride : undefined,
          ...rest,
          ...(hasPartnerAsRole && {
            contributors: [
              ...rest.contributors,
              {
                contributor: {
                  ...organisation,
                  type: 'organisations',
                  id: '123',
                },
                role: {
                  id: 'xxx',
                  title: 'Partner',
                },
              },
            ],
          }),
        }}
        Readme={Readme}
      />
    );
  },
};
