import { storiesOf } from '@storybook/react';
import Outro from '../../../common/views/components/Outro/Outro';
import Readme from '../../../common/views/components/Outro/README.md';

const OutroExample = () => {
  return <Outro
    researchItem={{
      title: 'The first use of ether in dental surgery 1846',
      item: {
        type: 'works',
        id: 'nyt37bss',
        title: 'The first use of ether in dental surgery, 1846. Ernest Board.'
      }
    }}
    readItem={{
      title: 'Get a taste of what to expect in Richard Barnett\'s The Smile Stealers',
      item: {
        type: 'books',
        id: '123',
        title: 'The Smile Stealers'
      }
    }}
    visitItem={{
      title: 'Living with Buildings opends 5 Oct',
      item: {
        type: 'exhibitions',
        id: '123',
        title: 'Living with Buildings'
      }
    }}
  />;
};

const stories = storiesOf('Components', module);
stories
  .add('Outro', OutroExample, {info: Readme});
