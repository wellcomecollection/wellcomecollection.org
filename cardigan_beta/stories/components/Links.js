import { storiesOf } from '@storybook/react';
import PrimaryLink from '../../../common/views/components/Links/PrimaryLink/PrimaryLink';
import SecondaryLink from '../../../common/views/components/Links/SecondaryLink/SecondaryLink';

const stories = storiesOf('Components', module);
stories.add('Primary link', () => (
  <PrimaryLink url={`#`} name={`View all exhibitions`} />
));
stories.add('Primary link: jump', () => (
  <PrimaryLink url={`#`} name={`See all dates/times to book`} isJumpLink={true} />
));
stories.add('Secondary link', () => (
  <SecondaryLink url={`#`} text={`Our event terms and conditions`} />
));
