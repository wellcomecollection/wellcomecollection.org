import { Meta, StoryObj } from '@storybook/react';

import ThemeSourcedDescription from '@weco/content/components/ThemeSourcedDescription';

const meta: Meta<typeof ThemeSourcedDescription> = {
  title: 'Components/ThemeSourcedDescription',
  component: ThemeSourcedDescription,
  args: {
    description:
      'The heat death of the universe is a hypothesis on the ultimate fate of the universe, which suggests the universe will evolve to a state of no thermodynamic free energy, and will therefore be unable to sustain processes that increase entropy.',
    source: 'wikidata',
    href: 'https://www.wikidata.org/wiki/Q139931',
  },
};

export default meta;

type Story = StoryObj<typeof ThemeSourcedDescription>;

export const Basic: Story = {
  name: 'ThemeSourcedDescription',
  render: args => (
    <div style={{ backgroundColor: '#9BC0AF', padding: '120px 40px' }}>
      <ThemeSourcedDescription {...args} />
    </div>
  ),
};
