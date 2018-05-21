import { storiesOf } from '@storybook/react';

import PrimaryLink from '../../common/views/components/Links/PrimaryLink/PrimaryLink';
import SecondaryLink from '../../common/views/components/Links/SecondaryLink/SecondaryLink';

const links = storiesOf('Links', module);
links.add('Primary link', () => (
  <PrimaryLink url={`#`} name={`Take me to the moon`} />
));
links.add('Secondary link', () => (
  <SecondaryLink url={`#`} text={`I want to be forever yours`} />
));
