import Outro from '@weco/common/views/components/Outro/Outro';

const Template = args => <Outro {...args} />;
export const basic = Template.bind({});
basic.args = {
  researchItem: {
    title: 'The first use of ether in dental surgery 1846',
    type: 'works',
    id: 'nyt37bss',
  },
  readItem: {
    title:
      "Get a taste of what to expect in Richard Barnett's The Smile Stealers",
    type: 'books',
    id: 'a',
  },
  visitItem: {
    title: 'Living with Buildings opens 5 Oct',
    type: 'exhibitions',
    id: 'b',
  },
};
basic.storyName = 'Outro';
