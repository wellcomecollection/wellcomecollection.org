import { ReadmeDecorator } from '@weco/cardigan/config/decorators';
import EventDatesLink from '@weco/content/components/EventDatesLink/EventDatesLink';
import Readme from '@weco/content/components/EventDatesLink/README.md';

const Template = args => (
  <ReadmeDecorator
    WrappedComponent={EventDatesLink}
    args={args}
    Readme={Readme}
  />
);
export const basic = Template.bind({});
basic.args = {
  id: 'test',
};
basic.storyName = 'EventDatesLink';
