import { Meta, StoryObj } from '@storybook/react';
import { ComponentProps } from 'react';

import { ReadmeDecorator } from '@weco/cardigan/config/decorators';
import { prismicPageIds } from '@weco/common/data/hardcoded-ids';
import PopupDialog from '@weco/common/views/components/PopupDialog';
import Readme from '@weco/common/views/components/PopupDialog/README.mdx';

type StoryProps = ComponentProps<typeof PopupDialog> & {
  openButtonText: string;
  title: string;
  text: string;
  linkText: string;
};

const openButtonText = 'Got five minutes?';
const title = 'Help us improve our website';
const text = 'Some more text inside the dialog';
const linkText = 'Take the survey';

const meta: Meta<StoryProps> = {
  title: 'Components/PopupDialog',
  component: PopupDialog,
  args: {
    document: {
      data: {
        openButtonText,
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
    openButtonText,
    title,
    text,
    linkText,
  },
  argTypes: {
    document: { table: { disable: true } },
    openButtonText: { control: 'text', name: 'Open button text' },
    title: { control: 'text', name: 'Title' },
    text: { control: 'text', name: 'Text' },
    linkText: { control: 'text', name: 'Link text' },
  },
};

export default meta;

type Story = StoryObj<StoryProps>;

export const Basic: Story = {
  name: 'PopupDialog',
  render: args => {
    const { openButtonText, title, text, linkText, ...rest } = args;
    args.document.data = {
      openButtonText,
      title,
      text: [
        {
          type: 'paragraph',
          text,
          spans: [],
        },
      ],
      linkText,
      link: {
        link_type: 'Web',
        url: `https://wellcomecollection.org/${prismicPageIds.userPanel}`,
      },
      isShown: true,
      routeRegex: null,
    };
    return (
      <ReadmeDecorator
        WrappedComponent={PopupDialog}
        args={{ ...rest, document: args.document }}
        Readme={Readme}
      />
    );
  },
};
