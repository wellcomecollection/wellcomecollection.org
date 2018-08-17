import { storiesOf } from '@storybook/react';
import LinkLabels from '../../../common/views/components/LinkLabels/LinkLabels';
import Readme from '../../../common/views/components/LinkLabels/README.md';

const stories = storiesOf('Components', module);
stories
  .add('LinkLabels', () => {
    return (
      <LinkLabels items={[{
        link: 'https://twitter.com/mafunyane',
        label: '@mafunyane'
      }, {
        link: 'https://strategiccontent.co.uk/',
        label: 'strategiccontent.co.uk'
      }]} />
    );
  }, {
    info: Readme
  });
