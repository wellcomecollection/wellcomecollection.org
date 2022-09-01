import EventDateRange from '@weco/content/components/EventDateRange/EventDateRange';

const dateString = '2022-03-01T13:15:00Z';

const now = new Date(dateString);
const firstDate = new Date(dateString);
const secondDate = new Date(dateString);
const thirdDate = new Date(dateString);
const fourthDate = new Date(dateString);
const fifthDate = new Date(dateString);

firstDate.setHours(now.getHours() - 48);
secondDate.setMinutes(now.getMinutes() + 1);
thirdDate.setHours(now.getHours() + 24);
fourthDate.setHours(secondDate.getHours() + 24);
fifthDate.setHours(thirdDate.getHours() + 24);

const times = [
  {
    range: {
      startDateTime: firstDate,
      endDateTime: thirdDate,
    },
  },
  {
    range: {
      startDateTime: secondDate,
      endDateTime: fourthDate,
    },
  },
  {
    range: {
      startDateTime: thirdDate,
      endDateTime: fifthDate,
    },
  },
];

const Template = args => <EventDateRange {...args} />;
export const basic = Template.bind({});
basic.args = {
  event: { times },
};
basic.storyName = 'EventDateRange';
