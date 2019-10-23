import { storiesOf } from '@storybook/react';
import { classNames, font } from '../../../common/utils/classnames';
import PopupDialog from '../../../common/views/components/PopupDialog/PopupDialog';
import Readme from '../../../common/views/components/PopupDialog/README.md';

const stories = storiesOf('Components', module);

const PopupDialogExample = () => {
  return (
    <PopupDialog
      openButtonText="Got 5 minutes?"
      cta={{ url: '#', text: 'Take the survey' }}
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
        We&apos;d like to know more about how you use Wellcome Collection&apos;s
        website.
      </p>
    </PopupDialog>
  );
};

stories.add('PopupDialog', PopupDialogExample, {
  readme: { sidebar: Readme },
});
