import PopupDialog from '@weco/common/views/components/PopupDialog/PopupDialog';
import { emptyPopupDialog } from '@weco/common/services/prismic/documents';
import Readme from '@weco/common/views/components/PopupDialog/README.md';
import { ReadmeDecorator } from '@weco/cardigan/config/decorators';

const Template = () => (
  <ReadmeDecorator
    WrappedComponent={PopupDialog}
    args={{ document: emptyPopupDialog() }}
    Readme={Readme}
  />
);
export const basic = Template.bind({});
basic.args = {
  openButtonText: 'Got five minutes?',
  linkText: 'Take the survey',
  link: 'https://wellcomecollection.org/user-panel',
  title: 'Help us improve our website',
  dialogText:
    'We’d like to know more about how you use Wellcome Collection’s website.',
};
basic.storyName = 'PopupDialog';
