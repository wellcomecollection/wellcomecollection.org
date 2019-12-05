import { storiesOf } from '@storybook/react';
import FeaturedCard from '../../../common/views/components/FeaturedCard/FeaturedCard';
import Readme from '../../../common/views/components/FeaturedCard/README.md';
import { image } from '../content';
import { select } from '@storybook/addon-knobs';

const stories = storiesOf('Components', module);

const FeaturedCardExample = () => {
  const imageWithoutTasl = { ...image(), showTasl: false };
  const color = select('text colour', ['white', 'black'], 'white');
  const background = select(
    'background colour',
    ['charcoal', 'cream'],
    'charcoal'
  );

  return (
    <FeaturedCard
      image={imageWithoutTasl}
      labels={[{ url: null, text: 'Essay' }]}
      title={`Remote diagnosis from wee to web`}
      link={{ url: '#', text: 'Remote diagnosis from wee to the web' }}
      background={background}
      color={color}
    >
      <h2 className="font-wb font-size-2">
        Remote diagnosis from wee to the Web
      </h2>
      <p className="font-hnl font-size-5">
        Medical practice might have moved on from when patients posted flasks of
        their urine for doctors to taste, but telehealth today keeps up the
        tradition of remote diagnosis – to our possible detriment.
      </p>
    </FeaturedCard>
  );
};

stories.add('FeaturedCard', () => <FeaturedCardExample />, {
  readme: { sidebar: Readme },
});
