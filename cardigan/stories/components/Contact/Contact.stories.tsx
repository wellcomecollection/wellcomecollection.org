import Contact from '@weco/common/views/components/Contact/Contact';
import ContactV2 from '@weco/common/views/components/Contact/Contact.V2';
import Readme from '@weco/common/views/components/Contact/README.md';
import { ReadmeDecorator } from '@weco/cardigan/config/decorators';

const args = {
  title: 'Joe Bloggs',
  subtitle: 'Head of Examples',
  phone: '+44 (0)20 7444 4444',
  email: 'j.bloggs@wellcome.ac.uk',
};

const ContactTemplate = args => (
  <ReadmeDecorator WrappedComponent={Contact} args={args} Readme={Readme} />
);
export const basic = ContactTemplate.bind({});
basic.args = args;
basic.storyName = 'Contact';

const ContactV2Template = args => (
  <ReadmeDecorator WrappedComponent={ContactV2} args={args} Readme={Readme} />
);
export const contactv2 = ContactV2Template.bind({});
contactv2.args = args;
contactv2.storyName = 'Contact: Visual Stories style';
