import { storiesOf } from '@storybook/react';
import Control from '../../../common/views/components/Buttons/Control/Control';
import Readme from '../../../common/views/components/Buttons/Control/README.md';
import { select } from '@storybook/addon-knobs/react';

const ControlExample = () => {
  const type = select('Type', ['light', 'dark'], 'light');

  return (
    <Control
      text={'text for a11y'}
      icon={'chevron'}
      extraClasses={`control--${type}`}
    />
  );
};

const stories = storiesOf('Components', module);
stories.add('Control', ControlExample, { info: Readme });
