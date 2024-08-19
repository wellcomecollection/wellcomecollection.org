import SeasonsHeader from '@weco/content/components/SeasonsHeader';
import { ImageType } from '@weco/common/model/image';
import { Season } from '@weco/content/types/seasons';
import { imagesBaseUrl } from '@weco/cardigan/stories/data/images';

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
  labels: [{ text: 'Season' }],
  title: 'What does it mean to be human, now?',
  start: new Date('2021-01-05T00:00:00.000Z'),
  end: new Date('2021-01-26T00:00:00.000Z'),
  untransformedStandfirst: {
    variation: 'default',
    version: 'initial',
    items: [],
    primary: {
      text: [
        {
          type: 'paragraph',
          text: 'How can we care for ourselves and for each other during extraordinary cultural, social and political shifts? Our programme brings multiple perspectives and voices into the building when we reopen, and across our digital platforms, based on our collecting and commissioning activities during the coronavirus pandemic.',
          spans: [],
        },
      ],
    },
    id: 'standfirst$53064ce6-03a9-44ca-a435-2c020922ff86',
    slice_type: 'standfirst',
    slice_label: null,
  },
  image: {
    width: image.width,
    height: image.height,
    contentUrl: image.contentUrl,
    alt: image.alt,
    richCrops: {
      '32:15': image,
    },
  },
  untransformedBody: [],
  type: 'seasons',
};

const Template = args => <SeasonsHeader {...args} />;
export const basic = Template.bind({});
basic.args = { season };
basic.parameters = {
  chromatic: {
    viewports: [375, 1200],
  },
};
basic.storyName = 'SeasonsHeader';
