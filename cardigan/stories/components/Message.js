import { storiesOf } from '@storybook/react';
import Message from '../../../common/views/components/Message/Message';
import { text } from '@storybook/addon-knobs/react';
import Readme from '../../../common/views/components/Message/README.md';

const MessageExample = () => {
  const messageText = text('Message text', 'Just turn up');

  return (
    <Message text={messageText} />
  );
};

const stories = storiesOf('Components', module);
stories
  .add('Message', MessageExample, {info: Readme});
