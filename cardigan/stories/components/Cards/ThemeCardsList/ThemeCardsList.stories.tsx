import { Meta, StoryObj } from '@storybook/react';
import { ComponentProps } from 'react';

import { mockIIIFImagesUrls } from '@weco/cardigan/stories/data/mock-iiif-images';
import { gridSize12 } from '@weco/common/views/components/Layout';
import ThemeCard from '@weco/common/views/components/ThemeCard';
import { ConceptImagesArray } from '@weco/content/hooks/useConceptImageUrls';
import ScrollContainer from '@weco/content/views/components/ScrollContainer';
import { ListItem } from '@weco/content/views/components/ScrollContainer/ScrollContainer.styles';

const cards = [
  {
    title: 'Photography',
    description:
      'The art and science of creating images using light and cameras',
  },
  {
    title: 'Surgery',
    description: 'Medical procedures involving manual or operative techniques',
  },
  {
    title: 'Mental health',
    description: "Conditions affecting a person's thinking, feeling, or mood",
  },
  {
    title: 'Genetics',
    description: 'The study of genes, heredity and genetic variation',
  },
  {
    title: 'Epidemics',
    description: 'The spread of disease across populations and regions',
  },
];

type StoryProps = ComponentProps<typeof ScrollContainer> & {
  cols: 3 | 4;
};

const meta: Meta<StoryProps> = {
  title: 'Components/Cards/ThemeCardsList',
  component: ScrollContainer,
  args: {
    useShim: false,
    cols: 4,
  },
  argTypes: {
    useShim: { table: { disable: true } },
    scrollButtonsAfter: { table: { disable: true } },
    cols: {
      name: 'ThemeCard columns',
      control: 'inline-radio',
      options: [3, 4],
    },
  },
  parameters: {
    chromatic: {
      viewports: [375, 1200],
    },
  },
};

export default meta;

type Story = StoryObj<StoryProps>;

export const InScrollContainer: Story = {
  name: 'ThemeCardsList',
  render: args => (
    <ScrollContainer gridSizes={gridSize12()} useShim={args.useShim}>
      {cards.map((card, i) => (
        <ListItem key={i} $usesShim={args.useShim} $cols={args.cols}>
          <ThemeCard
            title={card.title}
            description={card.description}
            images={mockIIIFImagesUrls as ConceptImagesArray}
            linkProps={{
              href: { pathname: '#', query: { conceptId: `concept-${i}` } },
            }}
          />
        </ListItem>
      ))}
    </ScrollContainer>
  ),
};
