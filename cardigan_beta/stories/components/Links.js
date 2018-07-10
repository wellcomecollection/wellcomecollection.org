import { storiesOf } from '@storybook/react';
import PrimaryLink from '../../../common/views/components/Links/PrimaryLink/PrimaryLink';
import SecondaryLink from '../../../common/views/components/Links/SecondaryLink/SecondaryLink';

const stories = storiesOf('Components', module);
stories.add('Primary link', () => (
  <PrimaryLink url={`#`} name={`Take me to the moon`} />
));
stories.add('Secondary link', () => (
  <SecondaryLink url={`#`} text={`I want to be forever yours`} />
));
