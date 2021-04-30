import { storiesOf } from '@storybook/react';
import ButtonOutlined from '../../../common/views/components/ButtonOutlined/ButtonOutlined';
import ButtonOutlinedLink from '../../../common/views/components/ButtonOutlinedLink/ButtonOutlinedLink';
import Readme from '../../../common/views/components/ButtonOutlined/README.md';
import { classNames } from '../../../common/utils/classnames';
import { boolean, text } from '@storybook/addon-knobs';

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
        <ButtonOutlinedLink
          icon={hasIcon ? 'arrowSmall' : undefined}
          text={buttonText}
          isOnDark={isOnDark}
        />
      ) : (
        <ButtonOutlined
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
stories.add('ButtonOutlined', ButtonExample, { readme: { sidebar: Readme } });
