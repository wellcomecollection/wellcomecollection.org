import { storiesOf } from '@storybook/react';
import Footer from '../../../common/views/components/Footer/Footer';
import Readme from '../../../common/views/components/Footer/README.md';
import { openingTimes } from '../content';

const FooterExample = () => {
  return <Footer openingTimes={openingTimes} />;
};

const stories = storiesOf('Components', module);
stories.add('Footer', FooterExample, {
  readme: { sidebar: Readme },
  isFullScreen: true,
});
