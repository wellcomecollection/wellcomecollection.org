import { storiesOf } from '@storybook/react';
import PopupDialog from '../../../common/views/components/PopupDialog/PopupDialog';
import Readme from '../../../common/views/components/PopupDialog/README.md';

const stories = storiesOf('Components', module);

const PopupDialogExample = () => {
  return (
    <PopupDialog
      openButtonText="Got 5 minutes?"
      cta={{ url: '#', text: 'Take the survey' }}
    >
      <h2 className="h2">Help us improve our website</h2>
      <p>
        We&apos;d like to know more about how you use Wellcome Collection&apos;s
        website.
      </p>
    </PopupDialog>
  );
};

stories.add('PopupDialog', PopupDialogExample, {
  readme: { sidebar: Readme },
});
