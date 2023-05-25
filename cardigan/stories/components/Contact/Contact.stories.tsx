import Contact from '@weco/common/views/components/Contact/Contact';
import Readme from '@weco/common/views/components/Contact/README.md';
import { ReadmeDecorator } from '@weco/cardigan/config/decorators';

const Template = args => (
  <ReadmeDecorator WrappedComponent={Contact} args={args} Readme={Readme} />
);
export const basic = Template.bind({});
basic.args = {
  title: 'Joe Bloggs',
  subtitle: 'Head of Examples',
  phone: '+44 (0)20 7444 4444',
  email: 'j.bloggs@wellcome.ac.uk',
};
basic.storyName = 'Contact';
