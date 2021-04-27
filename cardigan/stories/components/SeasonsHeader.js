import { storiesOf } from '@storybook/react';
import { UiImage } from '@weco/common/views/components/Images/Images';
import SeasonsHeader from '../../../common/views/components/SeasonsHeader/SeasonsHeader';
import Readme from '../../../common/views/components/SeasonsHeader/README.md';
import { boolean } from '@storybook/addon-knobs';

const image = {
  contentUrl:
    'https://images.prismic.io/wellcomecollection/7b0bfd6f-6a12-432f-9040-2c9724cb7605_ep_000832_016.jpg?auto=compress,format&rect=0,0,4000,2250&w=3200&h=1800',
  width: 3200,
  height: 1800,
  alt: null,
  tasl: {
    title: 'Refugee Astronaut by Yinka Shonibare CBE',
    author: null,
    sourceName: 'Wellcome Collection',
    sourceLink: null,
    license: null,
    copyrightHolder: null,
    copyrightLink: null,
  },
  crops: {},
};

const headerProps = {
  labels: { labels: [{ text: 'Article' }] },
  title: 'What does it mean to be human, now?',
  start: '2021-01-05T00:00:00.000Z',
  end: '2021-01-26T00:00:00.000Z',
  FeaturedMedia: <UiImage {...image} />,
  standfirst: [
    {
      type: 'paragraph',
      text:
        'Throughout history, pandemics have been powerful engines of change, exposing structural inequalities in the distribution of health and wealth.',
      spans: [],
    },
  ],
};

const SeasonsHeaderExample = () => {
  const hasDateRange = boolean('hasDateRange', true);
  return (
    <SeasonsHeader
      labels={headerProps.labels}
      title={headerProps.title}
      start={hasDateRange && headerProps.start}
      end={hasDateRange && headerProps.end}
      standfirst={headerProps.standfirst}
      FeaturedMedia={headerProps.FeaturedMedia}
    />
  );
};
const stories = storiesOf('Components', module);
stories.add('SeasonsHeader', SeasonsHeaderExample, {
  readme: { sidebar: Readme },
});
