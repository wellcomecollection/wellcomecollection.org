import { Meta, StoryObj } from '@storybook/react';

import { ReadmeDecorator } from '@weco/cardigan/config/decorators';
import { prismicPageIds } from '@weco/common/data/hardcoded-ids';
import PopupDialog from '@weco/common/views/components/PopupDialog';
import Readme from '@weco/common/views/components/PopupDialog/README.mdx';

const meta: Meta<typeof PopupDialog> = {
  title: 'Components/PopupDialog',
  component: PopupDialog,
  args: {
    document: {
      data: {
        openButtonText: 'Got five minutes?',
        linkText: 'Take the survey',
        link: {
          link_type: 'Web',
          url: `https://wellcomecollection.org/${prismicPageIds.userPanel}`,
        },
        title: 'Help us improve our website',
        text: [
          {
            type: 'paragraph',
            text: 'Some more text inside the dialog',
            spans: [],
          },
        ],
        isShown: true,
        routeRegex: null,
      },
    },
  },
};

export default meta;

type Story = StoryObj<typeof PopupDialog>;

export const Basic: Story = {
  name: 'PopupDialog',
  render: args => (
    <ReadmeDecorator
      WrappedComponent={PopupDialog}
      args={args}
      Readme={Readme}
    />
  ),
};
