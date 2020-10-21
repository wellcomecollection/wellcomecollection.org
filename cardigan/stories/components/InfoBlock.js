import { storiesOf } from '@storybook/react';
import InfoBlock from '../../../common/views/components/InfoBlock/InfoBlock';
import Readme from '../../../common/views/components/InfoBlock/README.md';

const InfoBlockExample = () => {
  return (
    <InfoBlock
      title={'Book your ticket'}
      text={[
        {
          type: 'list-item',
          text:
            'It’s still free to visit our museum and library. You’ll just need to choose a time slot and book a ticket before you arrive.',
          spans: [],
        },
        {
          type: 'list-item',
          text:
            'You can explore the museum for as long as you’d like, but  library sessions are now limited to either a morning or an afternoon. Library tickets include museum entry too.',
          spans: [],
        },
      ]}
      linkText={`Book your ticket`}
      link={{ link_type: 'Web', url: `/covid-book-your-ticket` }}
    />
  );
};

const stories = storiesOf('Components', module);
stories.add('InfoBlock', InfoBlockExample, { readme: { sidebar: Readme } });
