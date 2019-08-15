import { storiesOf } from '@storybook/react';
import NewsletterSignup from '../../../common/views/components/NewsletterSignup/NewsletterSignup';
import Readme from '../../../common/views/components/NewsletterSignup/README.md';

const NewsletterSignupExample = () => {
  return <NewsletterSignup />;
};

const stories = storiesOf('Components', module);
stories.add('NewsletterSignup', NewsletterSignupExample, {
  readme: { sidebar: Readme },
});
