import DateRange from '@weco/common/views/components/DateRange/DateRange';

const now = new Date();
const oneHourFromNow = new Date();
oneHourFromNow.setHours(now.getHours() + 1);
const oneWeekFromNow = new Date();
oneWeekFromNow.setHours(now.getHours() + 168);

const Template = args => <DateRange {...args} />;
export const sameDay = Template.bind({});
sameDay.args = {
  start: now,
  end: oneHourFromNow,
};
sameDay.storyName = 'Same day';

export const acrossMultipleDays = Template.bind({});
acrossMultipleDays.args = {
  start: now,
  end: oneWeekFromNow,
};
acrossMultipleDays.storyName = 'Across multiple days';
