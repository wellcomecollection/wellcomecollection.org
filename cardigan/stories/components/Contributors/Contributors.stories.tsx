import Contributors from '@weco/content/components/Contributors/Contributors';
import Readme from '@weco/content/components/Contributors/README.md';
import { ReadmeDecorator } from '@weco/cardigan/config/decorators';
import { organisation, person } from '@weco/cardigan/stories/data/content';

const Template = args => (
  <ReadmeDecorator
    WrappedComponent={Contributors}
    args={args}
    Readme={Readme}
  />
);
export const basic = Template.bind({});
basic.args = {
  contributors: [
    {
      contributor: {
        ...person,
        type: 'people',
        id: 'xxx',
      },
      role: {
        id: 'xxx',
        title: 'Speaker',
      },
      description: null,
    },
    {
      contributor: {
        ...organisation,
        type: 'organisations',
        id: '123',
      },
      role: {
        id: 'xxx',
        title: 'Partner',
      },
      description: null,
    },
  ],
};
basic.storyName = 'Contributors';
