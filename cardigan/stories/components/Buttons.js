import { storiesOf } from '@storybook/react';
import Button from '../../../common/views/components/Buttons/Button/Button';
import Readme from '../../../common/views/components/Buttons/Button/README.md';
import { boolean, text, select } from '@storybook/addon-knobs/react';

const ButtonExample = () => {
  const hasIcon = boolean('Has icon?', false);
  const type = select('Type', ['primary', 'secondary', 'tertiary'], 'primary');
  const buttonText = text('Button text', 'Click me');

  return (
    <Button
      icon={hasIcon ? 'email' : undefined}
      text={buttonText}
      extraClasses={`btn--${type}`}
    />
  );
};

const stories = storiesOf('Components', module);
stories
  .add('Buttons: Button', ButtonExample, {info: Readme});
