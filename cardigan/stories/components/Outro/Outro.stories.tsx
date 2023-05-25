import Outro from '@weco/content/components/Outro/Outro';
import Readme from '@weco/content/components/Outro/README.md';
import { ReadmeDecorator } from '@weco/cardigan/config/decorators';

const Template = args => (
  <ReadmeDecorator WrappedComponent={Outro} args={args} Readme={Readme} />
);
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
