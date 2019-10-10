import { storiesOf } from '@storybook/react';
import UserInitiatedDialog from '../../../common/views/components/UserInitiatedDialog/UserInitiatedDialog';
import Button from '../../../common/views/components/Buttons/Button/Button';
import Readme from '../../../common/views/components/UserInitiatedDialog/README.md';

const stories = storiesOf('Components', module);

const UserInitiatedDialogExample = () => {
  return (
    <UserInitiatedDialog openButtonText="Got 5 minutes?">
      <h2 className="h2">Help us improve our website</h2>
      <p>
        We&apos;d like to know more about how you use Wellcome Collection&apos;s
        website.
      </p>
      <Button type="primary" url="#" text="Take the survey" />
    </UserInitiatedDialog>
  );
};

stories.add('UserInitiatedDialog', UserInitiatedDialogExample, {
  readme: { sidebar: Readme },
});
