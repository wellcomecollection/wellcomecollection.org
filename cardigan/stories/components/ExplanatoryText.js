import { storiesOf } from '@storybook/react';
import Readme from '../../../common/views/components/ExplanatoryText/README.md';
import ExplanatoryText from '../../../common/views/components/ExplanatoryText/ExplanatoryText';
import { AppContextProvider } from '../../../common/views/components/AppContext/AppContext';
import { text } from '@storybook/addon-knobs/react';
import { singleLineOfText } from '../content';

const ExplanatoryTextExample = () => {
  return (
    <AppContextProvider>
      <ExplanatoryText id={'hidden'} controlText="Show me more">
        <p style={{ marginTop: '30px' }}>
          {text('Description', singleLineOfText(10, 20))}
        </p>
      </ExplanatoryText>
    </AppContextProvider>
  );
};

const stories = storiesOf('Components', module);

stories.add('ExplanatoryText', ExplanatoryTextExample, {
  readme: { sidebar: Readme },
});
