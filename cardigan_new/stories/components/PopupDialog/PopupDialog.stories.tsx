import { Meta, StoryObj } from '@storybook/react';

import { ReadmeDecorator } from '@weco/cardigan_new/config/decorators';
import PopupDialog from '@weco/common/views/components/PopupDialog/PopupDialog';
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
          url: 'https://wellcomecollection.org/user-panel',
        },
        title: 'Help us improve our website',
        dialogText:
          'We’d like to know more about how you use Wellcome Collection’s website.',
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
