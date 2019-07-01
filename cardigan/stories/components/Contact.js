import { storiesOf } from '@storybook/react';
import Contact from '../../../common/views/components/Contact/Contact';
import Readme from '../../../common/views/components/Contact/README.md';
import { text } from '@storybook/addon-knobs';
const stories = storiesOf('Components', module);

stories.add(
  'Contact',
  () => {
    const title = text('Title', 'Joe Bloggs');
    const subtitle = text('Subtitle', 'Head of Examples');
    const phone = text('Phone', '+44 (0)20 7444 4444');
    const email = text('Email', 'j.bloggs@wellcome.ac.uk');

    return (
      <Contact title={title} subtitle={subtitle} phone={phone} email={email} />
    );
  },
  {
    readme: { sidebar: Readme },
  }
);
