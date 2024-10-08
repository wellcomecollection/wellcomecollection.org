import { ReadmeDecorator } from '@weco/cardigan/config/decorators';
import EventDateRange from '@weco/content/components/EventDateRange';
import Readme from '@weco/content/components/EventDateRange/README.md';

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

const eventTimes = [
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

const Template = args => (
  <ReadmeDecorator
    WrappedComponent={EventDateRange}
    args={args}
    Readme={Readme}
  />
);
export const basic = Template.bind({});
basic.args = {
  eventTimes,
};
basic.storyName = 'EventDateRange';
