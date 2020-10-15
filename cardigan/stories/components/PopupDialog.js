import { storiesOf } from '@storybook/react';
import PopupDialog from '../../../common/views/components/PopupDialog/PopupDialog';
import Readme from '../../../common/views/components/PopupDialog/README.md';
import { text } from '@storybook/addon-knobs';

const stories = storiesOf('Components', module);

const PopupDialogExample = () => {
  const openButtonText = text('Open button text', 'Got five minutes?');
  const ctaText = text(
    'CTA inside the open dialog button text',
    'Take the survey'
  );
  const ctaLink = text(
    'CTA inside the open dialog button link',
    'https://wellcomecollection.org/user-panel'
  );
  const dialogHeading = text(
    'Heading inside the open dialog',
    'Help us improve our website'
  );
  const dialogCopy = text(
    'Text inside the open dialog',
    'We’d like to know more about how you use Wellcome Collection’s website.'
  );
  return (
    <PopupDialog
      openButtonText={openButtonText}
      ctaText={ctaText}
      ctaLink={{
        url: ctaLink,
        link_type: 'Web',
      }}
      dialogHeading={dialogHeading}
      dialogCopy={[
        {
          type: 'paragraph',
          text: dialogCopy,
          spans: [],
        },
      ]}
    />
  );
};

stories.add('PopupDialog', PopupDialogExample, {
  readme: { sidebar: Readme },
});
