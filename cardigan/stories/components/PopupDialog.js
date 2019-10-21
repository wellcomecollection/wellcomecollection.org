import { storiesOf } from '@storybook/react';
import { classNames, font } from '../../../common/utils/classnames';
import PopupDialog from '../../../common/views/components/PopupDialog/PopupDialog';
import Readme from '../../../common/views/components/PopupDialog/README.md';
import Space from '../../../common/views/components/styled/Space';

const stories = storiesOf('Components', module);

const PopupDialogExample = () => {
  return (
    <PopupDialog
      openButtonText="Got 5 minutes?"
      cta={{ url: '#', text: 'Take the survey' }}
    >
      <Space
        h={{
          size: 'm',
          properties: ['padding-right'],
          overrides: { small: 4, medium: 4, large: 4 },
        }}
      >
        <h2
          className={classNames({
            [font('wb', 6, { small: 5, medium: 5, large: 5 })]: true,
          })}
        >
          Help us improve our website
        </h2>
        <p
          className={classNames({
            [font('hnl', 5, { medium: 2, large: 2 })]: true,
          })}
        >
          We&apos;d like to know more about how you use Wellcome
          Collection&apos;s website.
        </p>
      </Space>
    </PopupDialog>
  );
};

stories.add('PopupDialog', PopupDialogExample, {
  readme: { sidebar: Readme },
});
