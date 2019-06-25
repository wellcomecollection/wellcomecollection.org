import { storiesOf } from '@storybook/react';
import Contact from '../../../common/views/components/Contact/Contact';
import Readme from '../../../common/views/components/Contact/README.md';

const stories = storiesOf('Components', module);

stories.add(
  'Contact',
  () => (
    <div className={`body-text`}>
      <Contact
        title={`Joe Bloggs`}
        phone={`+44 (0)20 7444 4444`}
        email={`j.bloggs@wellcome.ac.uk`}
      />
    </div>
  ),
  {
    readme: { sidebar: Readme },
  }
);
