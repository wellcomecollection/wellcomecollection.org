import CopyUrl from '@weco/catalogue/components/CopyUrl/CopyUrl';
import Readme from '@weco/catalogue/components/CopyUrl/README.md';
import { ReadmeDecorator } from '@weco/cardigan/config/decorators';

const Template = args => (
  <ReadmeDecorator WrappedComponent={CopyUrl} args={args} Readme={Readme} />
);
export const basic = Template.bind({});
basic.args = {
  id: 't59c279p',
  url: 'https://wellcomecollection.org/works/t59c279p',
};
basic.storyName = 'CopyUrl';
