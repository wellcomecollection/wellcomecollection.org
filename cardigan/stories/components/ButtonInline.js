import { storiesOf } from '@storybook/react';
import ButtonInline from '../../../common/views/components/ButtonInline/ButtonInline';
import ButtonInlineLink from '../../../common/views/components/ButtonInlineLink/ButtonInlineLink';
import Readme from '../../../common/views/components/ButtonInline/README.md';
import { classNames } from '../../../common/utils/classnames';
import { boolean, text } from '@storybook/addon-knobs/react';

const ButtonExample = () => {
  const buttonText = text('Button text', 'Click me');
  const isOnDark = boolean('Is on dark background?', false);
  const hasIcon = boolean('Has icon?', false);
  const isDisabled = boolean('Is disabled?', false);
  const isLink = boolean('Is link?', false);
  return (
    <div
      style={{ padding: '50px' }}
      className={classNames({
        'bg-black': isOnDark,
      })}
    >
      {isLink ? (
        <ButtonInlineLink
          icon={hasIcon ? 'arrowSmall' : undefined}
          text={buttonText}
          isOnDark={isOnDark}
        />
      ) : (
        <ButtonInline
          disabled={isDisabled}
          icon={hasIcon ? 'eye' : undefined}
          text={buttonText}
          isOnDark={isOnDark}
        />
      )}
    </div>
  );
};

const stories = storiesOf('Components', module);
stories.add('ButtonInline', ButtonExample, { readme: { sidebar: Readme } });
