import { storiesOf } from '@storybook/react';
import Divider from '../../../common/views/components/Divider/Divider';
import Readme from '../../../common/views/components/Divider/README.md';
import { select } from '@storybook/addon-knobs/react';

const DividerExample = () => {
  const type = select('Type', ['keyline', 'stub', 'thin', 'dashed'], 'keyline');

  return (
    <Divider
      extraClasses={`divider--${type} ${
        type === 'dashed' ? '' : 'divider--black'
      }`}
    />
  );
};

const stories = storiesOf('Components', module);
stories.add('Divider', DividerExample, { readme: { sidebar: Readme } });
