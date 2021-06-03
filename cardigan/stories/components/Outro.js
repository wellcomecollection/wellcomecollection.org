import { storiesOf } from '@storybook/react';
import Outro from '../../../common/views/components/Outro/Outro';
import Readme from '../../../common/views/components/Outro/README.md';

const OutroExample = () => {
  return (
    <Outro
      researchItem={{
        title: 'The first use of ether in dental surgery 1846',
        type: 'works',
        id: 'nyt37bss',
      }}
      readItem={{
        title:
          "Get a taste of what to expect in Richard Barnett's The Smile Stealers",
        type: 'books',
        id: 'a',
      }}
      visitItem={{
        title: 'Living with Buildings opens 5 Oct',
        type: 'exhibitions',
        id: 'b',
      }}
    />
  );
};

const stories = storiesOf('Components', module);
stories.add('Outro', OutroExample, { readme: { sidebar: Readme } });
