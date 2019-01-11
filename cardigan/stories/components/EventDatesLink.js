import { storiesOf } from '@storybook/react';
import EventDatesLink from '../../../common/views/components/EventDatesLink/EventDatesLink';
import Readme from '../../../common/views/components/EventDatesLink/README.md';

const stories = storiesOf('Components', module);
stories.add('EventDatesLink', () => (
  <EventDatesLink id={`someEventId`} />
), {info: Readme});
