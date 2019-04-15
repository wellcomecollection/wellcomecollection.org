import { storiesOf } from '@storybook/react';
import NewsletterPromo from '../../../common/views/components/NewsletterPromo/NewsletterPromo';
import Readme from '../../../common/views/components/NewsletterPromo/README.md';

const NewsletterPromoExample = () => {
  return <NewsletterPromo />;
};

const stories = storiesOf('Components/Promos', module);
stories.add('NewsletterPromo', NewsletterPromoExample, { info: Readme });
