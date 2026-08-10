import { Meta, StoryObj } from '@storybook/react';

import PlainList from '@weco/common/views/components/styled/PlainList';
import CollectionsHeader from '@weco/content/views/components/CollectionsHeader';

const meta: Meta<typeof CollectionsHeader> = {
  title: 'Components/CollectionsHeader',
  component: CollectionsHeader,
  args: {
    title: 'Archives',
    introText: 'Original records created by individuals and organisations.',
  },
  argTypes: {
    navigation: { table: { disable: true } },
    afterIntro: { table: { disable: true } },
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
    navigation: (
      <nav aria-label="Example category navigation">
        <PlainList style={{ display: 'flex', gap: '1em' }}>
          <li>People and organisations</li>
          <li>
            <strong>Subjects</strong>
          </li>
          <li>Types and techniques</li>
          <li>Places</li>
        </PlainList>
      </nav>
    ),
    afterIntro: <p>Example slotted content, eg a sub-category menu.</p>,
  },
};
