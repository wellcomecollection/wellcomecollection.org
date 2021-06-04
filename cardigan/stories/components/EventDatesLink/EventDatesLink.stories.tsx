import EventDatesLink from '@weco/common/views/components/EventDatesLink/EventDatesLink';

const Template = args => <EventDatesLink {...args} />;
export const basic = Template.bind({});
basic.args = {
  id: 'test',
};
basic.storyName = 'EventDatesLink';
