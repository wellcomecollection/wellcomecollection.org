import Contributors from '@weco/common/views/components/Contributors/Contributors';
import { organisation, person } from '../../content';

const Template = args => <Contributors {...args} />;
export const basic = Template.bind({});
basic.args = {
  contributors: [
    {
      contributor: {
        type: 'people',
        id: 'xxx',
        ...person(),
      },
      role: {
        id: 'xxx',
        title: 'Speaker',
      },
      description: null,
    },
    {
      contributor: {
        type: 'organisations',
        id: 'xxx',
        ...organisation(),
      },
      role: {
        id: 'xxx',
        title: 'Partner',
      },
      description: null,
    },
  ],
  titleOverride: '',
};
basic.storyName = 'Contributors';
