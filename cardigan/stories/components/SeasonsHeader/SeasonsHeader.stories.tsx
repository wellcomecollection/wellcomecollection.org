import SeasonsHeader from '@weco/content/components/SeasonsHeader';
import { ImageType } from '@weco/common/model/image';
import { Season } from '@weco/content/types/seasons';
import { imagesBaseUrl } from '../../content';

const image: ImageType = {
  contentUrl: `${imagesBaseUrl}/reading-room-3200x1800.jpg`,
  width: 3200,
  height: 1800,
  alt: '',
  tasl: {
    title: 'Refugee Astronaut by Yinka Shonibare CBE',
    sourceName: 'Wellcome Collection',
  },
};

const season: Season = {
  id: 'X84FvhIAACUAqiqp',
  labels: [{ text: 'Article' }],
  title: 'What does it mean to be human, now?',
  start: new Date('2021-01-05T00:00:00.000Z'),
  end: new Date('2021-01-26T00:00:00.000Z'),
  standfirst: [
    {
      type: 'paragraph',
      text: 'Throughout history, pandemics have been powerful engines of change, exposing structural inequalities in the distribution of health and wealth.',
      spans: [],
    },
  ],
  image: {
    width: image.width,
    height: image.height,
    contentUrl: image.contentUrl,
    alt: image.alt,
    richCrops: {
      '32:15': image,
    },
  },
  body: [],
  untransformedBody: [],
  type: 'seasons',
};

const Template = args => <SeasonsHeader {...args} />;
export const basic = Template.bind({});
basic.args = { season };
basic.parameters = {
  chromatic: {
    diffThreshold: 0.2,
    viewports: [375, 1200],
    delay: 500, // The image loads slowly
  },
};
basic.storyName = 'SeasonsHeader';
