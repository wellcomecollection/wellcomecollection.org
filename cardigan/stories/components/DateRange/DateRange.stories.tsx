import DateRange from '@weco/common/views/components/DateRange/DateRange';

const now = new Date('2022-03-01T13:15:00Z');
const oneHourFromNow = new Date('2022-03-01T13:15:00Z');
oneHourFromNow.setHours(now.getHours() + 1);
const oneWeekFromNow = new Date('2022-03-01T13:15:00Z');
oneWeekFromNow.setHours(now.getHours() + 168);

const Template = args => <DateRange {...args} />;
export const sameDay = Template.bind({});
sameDay.args = {
  start: now,
  end: oneHourFromNow,
};
sameDay.storyName = 'Same day';
sameDay.parameters = { chromatic: { viewports: [375, 1200] } };

export const acrossMultipleDays = Template.bind({});
acrossMultipleDays.args = {
  start: now,
  end: oneWeekFromNow,
};
acrossMultipleDays.storyName = 'Across multiple days';
acrossMultipleDays.parameters = { chromatic: { viewports: [375, 1200] } };

export const withSplit = Template.bind({});
withSplit.args = {
  start: now,
  end: oneHourFromNow,
  splitTime: true,
};
withSplit.storyName = 'With date/time on separate lines';
withSplit.parameters = { chromatic: { viewports: [375, 1200] } };
