import { Meta, StoryObj } from '@storybook/react';

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

const meta: Meta<typeof InfoBox> = {
  title: 'Components/InfoBox',
  component: InfoBox,
  args: {
    title: 'Visit us',
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
  },
  argTypes: {
    children: { table: { disable: true } },
    items: { table: { disable: true } },
    headingClasses: { table: { disable: true } },
  },
};

export default meta;

type Story = StoryObj<typeof InfoBox>;

export const Basic: Story = {
  name: 'InfoBox',
  render: args => (
    <ReadmeDecorator WrappedComponent={InfoBox} args={args} Readme={Readme} />
  ),
};
