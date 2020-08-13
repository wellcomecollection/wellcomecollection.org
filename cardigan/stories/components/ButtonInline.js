import { storiesOf } from '@storybook/react';
import ButtonInline from '../../../common/views/components/ButtonInline/ButtonInline';
import ButtonInlineLink from '../../../common/views/components/ButtonInlineLink/ButtonInlineLink';
import Readme from '../../../common/views/components/ButtonInline/README.md';
import { boolean, text } from '@storybook/addon-knobs/react';

const ButtonExample = () => {
  const buttonText = text('Button text', 'Click me');
  const hasIcon = boolean('Has icon?', false);
  const isDisabled = boolean('Is disabled?', false);
  const isLink = boolean('Is link?', false);
  return isLink ? (
    <ButtonInlineLink
      icon={hasIcon ? 'arrowSmall' : undefined}
      text={buttonText}
    />
  ) : (
    <ButtonInline
      disabled={isDisabled}
      icon={hasIcon ? 'eye' : undefined}
      text={buttonText}
    />
  );
};

const stories = storiesOf('Components', module);
stories.add('ButtonInline', ButtonExample, { readme: { sidebar: Readme } });
