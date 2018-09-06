import { storiesOf } from '@storybook/react';
import LinkLabels from '../../../common/views/components/LinkLabels/LinkLabels';
import Readme from '../../../common/views/components/LinkLabels/README.md';

const stories = storiesOf('Components', module);
stories
  .add('LinkLabels', () => {
    return (
      <LinkLabels items={[{
        url: 'https://twitter.com/mafunyane',
        text: '@mafunyane'
      }, {
        url: 'https://strategiccontent.co.uk/',
        text: 'strategiccontent.co.uk'
      }]} />
    );
  }, {
    info: Readme
  });
