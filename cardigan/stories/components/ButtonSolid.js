import { storiesOf } from '@storybook/react';
import ButtonSolid from '../../../common/views/components/ButtonSolid/ButtonSolid';
// import Readme from '../../../common/views/components/ButtonSolid/README.md';
import { boolean, text } from '@storybook/addon-knobs/react';

const ButtonExample = () => {
  const hasIcon = boolean('Has icon?', false);
  const buttonText = text('Button text', 'Click me');
  const isDisabled = boolean('Is disabled?', false);

  return (
    <ButtonSolid
      disabled={isDisabled}
      icon={hasIcon ? 'book' : undefined}
      text={buttonText}
    />
  );
};

const stories = storiesOf('Components', module);
stories.add('Solid Button', ButtonExample);
// stories.add('Solid Button', ButtonExample, { readme: { sidebar: Readme } });
