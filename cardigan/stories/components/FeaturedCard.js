import { storiesOf } from '@storybook/react';
import FeaturedCard from '../../../common/views/components/FeaturedCard/FeaturedCard';
import Layout12 from '../../../common/views/components/Layout12/Layout12';
import Readme from '../../../common/views/components/FeaturedCard/README.md';
import { image } from '../content';
import { select, boolean } from '@storybook/addon-knobs';

const stories = storiesOf('Components', module);

const FeaturedCardExample = () => {
  const imageWithoutTasl = { ...image(), showTasl: false };
  const isReversed = boolean('is reversed', false);
  const color = select('text colour', ['white', 'black'], 'white');
  const background = select(
    'background colour',
    ['charcoal', 'cream'],
    'charcoal'
  );

  return (
    <Layout12>
      <FeaturedCard
        image={imageWithoutTasl}
        labels={[{ text: 'Essay' }]}
        title={`Remote diagnosis from wee to web`}
        link={{ url: '#', text: 'Remote diagnosis from wee to the web' }}
        background={background}
        color={color}
        isReversed={isReversed}
      >
        <h2 className="font-wb font-size-2">
          Remote diagnosis from wee to the Web
        </h2>
        <p className="font-hnl font-size-5">
          Medical practice might have moved on from when patients posted flasks
          of their urine for doctors to taste, but telehealth today keeps up the
          tradition of remote diagnosis – to our possible detriment.
        </p>
      </FeaturedCard>
    </Layout12>
  );
};

stories.add('FeaturedCard', () => <FeaturedCardExample />, {
  readme: { sidebar: Readme },
});
