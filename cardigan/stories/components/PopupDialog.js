import { storiesOf } from '@storybook/react';
import PopupDialog from '../../../common/views/components/PopupDialog/PopupDialog';
import Readme from '../../../common/views/components/PopupDialog/README.md';

const stories = storiesOf('Components', module);

const PopupDialogExample = () => {
  return (
    <PopupDialog
      openButtonText={`Got 5 minutes?`}
      ctaText={`Take the survey`}
      ctaLink={{
        url: 'https://wellcomecollection.org/user-panel',
        link_type: 'Web',
      }}
      dialogHeading={`Help us improve our website`}
      dialogCopy={[
        {
          type: 'paragraph',
          text:
            'We’d like to know more about how you use Wellcome Collection’s website.',
          spans: [],
        },
      ]}
    />
  );
};

stories.add('PopupDialog', PopupDialogExample, {
  readme: { sidebar: Readme },
});
