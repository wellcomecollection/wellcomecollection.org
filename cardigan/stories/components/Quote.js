import { storiesOf } from '@storybook/react';
import Quote from '../../../common/views/components/Quote/Quote';
import { boolean } from '@storybook/addon-knobs/react';
import Readme from '../../../common/views/components/Quote/README.md';
import {quote} from '../content';

const QuoteExample = () => {
  const isPullOrReview = boolean('is pull or review quote', false);

  const quoteText = quote().text;
  const quoteCitation = quote().citation;

  return (
    <Quote
      text={quoteText}
      citation={quoteCitation}
      isPullOrReview={isPullOrReview} />
  );
};

const stories = storiesOf('Components', module);
stories
  .add('Quote', QuoteExample, {info: Readme});
