import { storiesOf } from '@storybook/react';
import TruncatedText from '../../../common/views/components/TruncatedText/TruncatedText';
import Readme from '../../../common/views/components/TruncatedText/README.md';
import { text } from '@storybook/addon-knobs/react';

const stories = storiesOf('Components', module);

const TruncatedTextExample = () => {
  const someText = text(
    'Text',
    'Lorem ipsum dolor sit amet consectetur adipisicing elit. Vitae, minima rem? Quod voluptatum molestiae optio necessitatibus?'
  );

  return <TruncatedText className={`h1`}>{someText}</TruncatedText>;
};

stories.add('TruncatedText', TruncatedTextExample, {
  readme: { sidebar: Readme },
});
