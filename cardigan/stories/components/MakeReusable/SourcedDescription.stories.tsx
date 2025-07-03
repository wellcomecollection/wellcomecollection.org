import { Meta, StoryObj } from '@storybook/react';
import { ComponentProps } from 'react';

import SourcedDescription from '@weco/common/views/components/SourcedDescription';

type Props = ComponentProps<typeof SourcedDescription> & {
  seeRawComponent?: boolean;
};

const meta: Meta<
  Omit<Props, 'source'> & {
    source:
      | 'Wikidata'
      | 'MeSH'
      | 'Library of Congress (names)'
      | 'Library of Congress (subjects)';
  }
> = {
  title: 'To be made reusable/SourcedDescription',
  component: SourcedDescription,
  args: {
    description:
      'The heat death of the universe is a hypothesis on the ultimate fate of the universe, which suggests the universe will evolve to a state of no thermodynamic free energy, and will therefore be unable to sustain processes that increase entropy.',
    source: 'Wikidata',
    href: 'https://www.wikidata.org/wiki/Q139931',
    seeRawComponent: false,
  },
  argTypes: {
    href: { table: { disable: true } },
    seeRawComponent: {
      control: { type: 'boolean' },
      name: 'See raw component',
    },
    description: {
      name: 'Copy / Description',
    },
    source: {
      name: 'Source ontology',
      options: [
        'Wikidata',
        'MeSH',
        'Library of Congress (names)',
        'Library of Congress (subjects)',
      ],
      control: { type: 'select' },
      description: 'Source ontology of the description',
      mapping: {
        Wikidata: 'wikidata',
        MeSH: 'nlm-mesh',
        'Library of Congress (names)': 'lc-names',
        'Library of Congress (subjects)': 'lc-subjects',
      },
    },
  },
};

export default meta;

export const Basic: StoryObj<Props> = {
  name: 'SourcedDescription',
  render: args => {
    return (
      <div
        style={
          args.seeRawComponent
            ? {}
            : { backgroundColor: '#9BC0AF', padding: '120px 40px' }
        }
      >
        <SourcedDescription {...args} />
      </div>
    );
  },
};
