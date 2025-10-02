import { Meta, StoryObj } from '@storybook/react';
import { ComponentProps } from 'react';

import { ReadmeDecorator } from '@weco/cardigan/config/decorators';
import { prismicPageIds } from '@weco/common/data/hardcoded-ids';
import {
  a11YVisual,
  accessible,
  clock,
  location,
  ticket,
} from '@weco/common/icons';
import InfoBox from '@weco/content/views/components/InfoBox';
import Readme from '@weco/content/views/components/InfoBox/README.mdx';

type StoryProps = ComponentProps<typeof InfoBox> & {
  hasChildContent?: boolean;
};

const meta: Meta<StoryProps> = {
  title: 'Components/InfoBox',
  component: InfoBox,
  args: {
    title: 'Visit us',
    hasBiggerHeading: false,
    items: [
      {
        description: [
          {
            type: 'paragraph',
            text: 'Free admission',
            spans: [],
          },
        ],
        icon: ticket,
      },
      {
        description: [
          {
            type: 'paragraph',
            text: 'Galleries open Tuesday–Sunday, Opening times',
            spans: [
              {
                type: 'hyperlink',
                start: 31,
                end: 44,
                data: {
                  link_type: 'Web',
                  url: `/visit-us/${prismicPageIds.openingTimes}`,
                },
              },
            ],
          },
        ],
        icon: clock,
      },
      {
        description: [
          {
            type: 'paragraph',
            text: 'Medicine Man gallery, level 1',
            spans: [],
          },
        ],
        icon: location,
      },
      {
        description: [
          {
            type: 'paragraph',
            text: 'Step-free access is available to all floors of the building',
            spans: [],
          },
        ],
        icon: accessible,
      },
      {
        description: [
          {
            type: 'paragraph',
            text: 'Large-print guides, transcripts and magnifiers are available in the gallery',
            spans: [],
          },
        ],
        icon: a11YVisual,
      },
    ],
    children: (
      <p>Here is some extra content, it can be whatever HTML you want.</p>
    ),
    hasChildContent: false,
  },
  argTypes: {
    children: { table: { disable: true } },
    items: { table: { disable: true } },
    hasBiggerHeading: {
      name: 'Use larger heading',
      control: 'boolean',
    },
    hasChildContent: {
      name: 'Has child content',
      control: 'boolean',
    },
  },
};

export default meta;

type Story = StoryObj<StoryProps>;

const Template = (args: StoryProps) => {
  const { hasChildContent, ...rest } = args;

  return (
    <InfoBox {...rest}>
      {hasChildContent ? (
        <p>Here is some extra content, it can be whatever HTML you want.</p>
      ) : undefined}
    </InfoBox>
  );
};
export const Basic: Story = {
  name: 'InfoBox',
  render: args => {
    return (
      <ReadmeDecorator
        WrappedComponent={Template}
        args={args}
        Readme={Readme}
      />
    );
  },
};
