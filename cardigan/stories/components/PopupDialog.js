import { storiesOf } from '@storybook/react';
import PopupDialog from '../../../common/views/components/PopupDialog/PopupDialog';
import Readme from '../../../common/views/components/PopupDialog/README.md';
import { text } from '@storybook/addon-knobs';

const stories = storiesOf('Components', module);

const PopupDialogExample = () => {
  const openButtonText = text('Open button text', 'Got five minutes?');
  const linkText = text(
    'CTA inside the open dialog button text',
    'Take the survey'
  );
  const link = text(
    'CTA inside the open dialog button link',
    'https://wellcomecollection.org/user-panel'
  );
  const title = text(
    'Title inside the open dialog',
    'Help us improve our website'
  );
  const dialogText = text(
    'Text inside the open dialog',
    'We’d like to know more about how you use Wellcome Collection’s website.'
  );

  return (
    <PopupDialog
      openButtonText={openButtonText}
      linkText={linkText}
      link={{
        url: link,
        link_type: 'Web',
      }}
      title={title}
      text={[
        {
          type: 'paragraph',
          text: dialogText,
          spans: [],
        },
      ]}
    />
  );
};

stories.add('PopupDialog', PopupDialogExample, {
  readme: { sidebar: Readme },
});
