import { Meta, StoryObj } from '@storybook/react';

import CollectionsHeader from '@weco/content/views/components/CollectionsHeader';
import ThematicBrowsingNavigation from '@weco/content/views/layouts/ThematicBrowsingLayout/ThematicBrowsing.Navigation';

const meta: Meta<typeof CollectionsHeader> = {
  title: 'Components/CollectionsHeader',
  component: CollectionsHeader,
  // The breadcrumb/navigation links here point at real site paths (eg
  // /collections), which don't exist in cardigan's own standalone
  // deployment - stop them from navigating away from the story at all,
  // rather than 404ing.
  decorators: [
    Story => (
      <div
        onClickCapture={e => {
          if ((e.target as HTMLElement).closest('a')) e.preventDefault();
        }}
      >
        <Story />
      </div>
    ),
  ],
  args: {
    title: 'Archives',
    introText: 'Original records created by individuals and organisations.',
  },
  argTypes: {
    title: { name: 'Title' },
    introText: { name: 'Intro text', control: 'text' },
    extraBreadcrumbs: { name: 'Extra breadcrumbs', table: { disable: true } },
    navigation: { name: 'Navigation', table: { disable: true } },
    afterIntro: { name: 'After-intro content', table: { disable: true } },
  },
};

export default meta;

type Story = StoryObj<typeof CollectionsHeader>;

export const Basic: Story = {
  name: 'CollectionsHeader',
};

export const WithNavigation: Story = {
  name: 'With navigation and after-intro content',
  args: {
    title: 'Subjects',
    introText: 'Browse the collection by subject.',
    navigation: <ThematicBrowsingNavigation currentCategory="subjects" />,
    afterIntro: <p>Example slotted content, eg a sub-category menu.</p>,
  },
};
