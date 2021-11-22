import EventDatesLink from '@weco/content/components/EventDatesLink/EventDatesLink';

const Template = args => <EventDatesLink {...args} />;
export const basic = Template.bind({});
basic.args = {
  id: 'test',
};
basic.storyName = 'EventDatesLink';
