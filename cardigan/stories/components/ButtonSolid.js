import { storiesOf } from '@storybook/react';
import ButtonSolid from '../../../common/views/components/ButtonSolid/ButtonSolid';
import ButtonSolidLink from '../../../common/views/components/ButtonSolid/ButtonSolidLink';
import Readme from '../../../common/views/components/ButtonSolid/README.md';
import { boolean, text } from '@storybook/addon-knobs/react';

const ButtonExample = () => {
  const hasIcon = boolean('Has icon?', false);
  const buttonText = text('Button text', 'Click me');
  const isDisabled = boolean('Is disabled?', false);
  const isBig = boolean('Is big?', false);
  const isLink = boolean('Is link', false);
  return isLink ? (
    <ButtonSolidLink
      link={`https://google.com`}
      icon={hasIcon ? 'eye' : undefined}
      text={buttonText}
      big={isBig}
    />
  ) : (
    <ButtonSolid
      disabled={isDisabled}
      icon={hasIcon ? 'eye' : undefined}
      text={buttonText}
      big={isBig}
    />
  );
};

const stories = storiesOf('Components', module);
stories.add('Solid Button', ButtonExample);
stories.add('Solid Button', ButtonExample, { readme: { sidebar: Readme } });
