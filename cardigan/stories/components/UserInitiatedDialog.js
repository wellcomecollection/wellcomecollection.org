import { storiesOf } from '@storybook/react';
import UserInitiatedDialog from '../../../common/views/components/UserInitiatedDialog/UserInitiatedDialog';
import Readme from '../../../common/views/components/UserInitiatedDialog/README.md';

const stories = storiesOf('Components', module);

const UserInitiatedDialogExample = () => {
  return (
    <UserInitiatedDialog
      openButtonText="Got 5 minutes?"
      cta={{ url: '#', text: 'Take the survey' }}
    >
      <h2 className="h2">Help us improve our website</h2>
      <p>
        We&apos;d like to know more about how you use Wellcome Collection&apos;s
        website.
      </p>
    </UserInitiatedDialog>
  );
};

stories.add('UserInitiatedDialog', UserInitiatedDialogExample, {
  readme: { sidebar: Readme },
});
