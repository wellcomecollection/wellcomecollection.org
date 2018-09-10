import { storiesOf } from '@storybook/react';
import { withKnobs, text } from '@storybook/addon-knobs/react';
import Readme from '../../../common/views/components/ExhibitionHeader/README.md';

import StatusIndicator from '../../../common/views/components/StatusIndicator/StatusIndicator';
import DateRange from '../../../common/views/components/DateRange/DateRange';
import {pictureImages} from '../content';
import ExhibitionHeader from '../../../common/views/components/ExhibitionHeader/ExhibitionHeader';
import Picture from '../../../common/views/components/Picture/Picture';

const stories = storiesOf('Components', module).addDecorator(withKnobs);

const Header = () => {
  const title = text('Title', 'Teeth');
  const now = new Date();
  const threeMonthsAgo = new Date(now.getTime() - (60 * 60 * 24 * 90 * 1000));
  const threeWeeksFromNow = new Date(now.getTime() + (60 * 60 * 24 * 21 * 1000));
  const DateInfo = <DateRange start={threeMonthsAgo} end={threeWeeksFromNow} />;

  return (
    <ExhibitionHeader
      topLink={{url: '/', text: 'Exhibitions'}}
      title={title}
      FeaturedMedia={<Picture images={pictureImages} isFull={true} />}
      DateInfo={DateInfo}
      InfoBar={<StatusIndicator start={threeMonthsAgo} end={threeWeeksFromNow} />}
    />
  );
};

stories
  .add('Headers: Exhibition', Header, {info: Readme});
