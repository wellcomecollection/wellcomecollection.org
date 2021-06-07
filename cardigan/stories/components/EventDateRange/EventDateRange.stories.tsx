import EventDateRange from '@weco/common/views/components/EventDateRange/EventDateRange';

const now = new Date();
const firstDate = new Date();
const secondDate = new Date();
const thirdDate = new Date();
const fourthDate = new Date();
const fifthDate = new Date();

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
