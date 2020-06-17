import { storiesOf } from '@storybook/react';
import ButtonOutlined from '../../../common/views/components/ButtonOutlined/ButtonOutlined';
import Readme from '../../../common/views/components/ButtonSolid/README.md';
import { boolean, text } from '@storybook/addon-knobs/react';

const ButtonExample = () => {
  const buttonText = text('Button text', 'Click me');
  const hasIcon = boolean('Has icon?', false);
  const isDisabled = boolean('Is disabled?', false);
  const isLink = boolean('Is link?', false);
  return isLink ? (
    <p>TODO: this</p>
  ) : (
    <ButtonOutlined
      disabled={isDisabled}
      icon={hasIcon ? 'eye' : undefined}
      text={buttonText}
    />
  );
};

const stories = storiesOf('Components', module);
stories.add('ButtonOutlined', ButtonExample);
stories.add('ButtonOutlined', ButtonExample, { readme: { sidebar: Readme } });
