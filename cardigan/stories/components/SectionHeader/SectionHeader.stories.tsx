import SectionHeader from '@weco/common/views/components/SectionHeader/SectionHeader';
import Readme from '@weco/common/views/components/SectionHeader/README.md';
import { ReadmeDecorator } from '@weco/cardigan/config/decorators';

const Template = args => (
  <ReadmeDecorator
    WrappedComponent={SectionHeader}
    args={args}
    Readme={Readme}
  />
);
export const basic = Template.bind({});
basic.args = {
  title: 'You may have missed',
};
basic.storyName = 'SectionHeader';
