import { storiesOf } from '@storybook/react';
import { text, radios, select } from '@storybook/addon-knobs';
import faker from 'faker';
import { randomNumber } from '../content';
import MetaUnit from '../../../common/views/components/MetaUnit/MetaUnit';
import Readme from '../../../common/views/components/MetaUnit/README.md';

const MetaUnitExample = () => {
  const title = text('Title', faker.random.words(randomNumber(2, 4)));

  const dataValue = radios(
    'Data',
    {
      text: 'text',
      list: 'list',
      links: 'links',
    },
    'text'
  );

  const headingLevel = select('Heading level', [1, 2, 3, 4, 5, 6], 2);

  const componentContent = {
    headingText: title,
    headingLevel: headingLevel,
    links:
      dataValue === 'links'
        ? [
            { text: 'Warlock', url: '#' },
            { text: 'Witch', url: '#' },
            { text: 'Gallows', url: '#' },
          ]
        : [],
    list:
      dataValue === 'list'
        ? [
            faker.random.words(randomNumber(1, 4)),
            faker.random.words(randomNumber(1, 4)),
            faker.random.words(randomNumber(1, 4)),
            faker.random.words(randomNumber(1, 4)),
          ]
        : [],
    text:
      dataValue === 'text'
        ? [
            faker.random.words(randomNumber(4, 12)),
            faker.random.words(randomNumber(4, 12)),
            faker.random.words(randomNumber(4, 12)),
          ]
        : [],
  };

  return <MetaUnit {...componentContent} />;
};

const stories = storiesOf('Components', module);
stories.add('MetaUnit', MetaUnitExample, { info: Readme });
