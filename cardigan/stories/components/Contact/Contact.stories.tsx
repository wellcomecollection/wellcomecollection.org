import Contact from '@weco/common/views/components/Contact/Contact';

const Template = args => <Contact {...args} />;
export const basic = Template.bind({});
basic.args = {
  title: 'Joe Bloggs',
  subtitle: 'Head of Examples',
  phone: '+44 (0)20 7444 4444',
  email: 'j.bloggs@wellcome.ac.uk',
};
basic.storyName = 'Contact';
