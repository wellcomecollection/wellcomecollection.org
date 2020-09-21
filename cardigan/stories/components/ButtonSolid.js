import { storiesOf } from '@storybook/react';
import ButtonSolid from '../../../common/views/components/ButtonSolid/ButtonSolid';
import ButtonSolidLink from '../../../common/views/components/ButtonSolidLink/ButtonSolidLink';
import Readme from '../../../common/views/components/ButtonSolid/README.md';
import { boolean, text } from '@storybook/addon-knobs/react';

const ButtonExample = () => {
  const buttonText = text('Button text', 'Click me');
  const hasIcon = boolean('Has icon?', false);
  const isDisabled = boolean('Is disabled?', false);
  const isBig = boolean('Is big?', false);
  const isLink = boolean('Is link?', false);
  return isLink ? (
    <ButtonSolidLink
      link={`https://wellcomecollection.org`}
      icon={hasIcon ? 'eye' : undefined}
      text={buttonText}
      isBig={isBig}
    />
  ) : (
    <ButtonSolid
      disabled={isDisabled}
      icon={hasIcon ? 'eye' : undefined}
      text={buttonText}
      isBig={isBig}
    />
  );
};

const stories = storiesOf('Components', module);
stories.add('ButtonSolid', ButtonExample);
stories.add('ButtonSolid', ButtonExample, { readme: { sidebar: Readme } });
