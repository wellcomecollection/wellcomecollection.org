import { storiesOf } from '@storybook/react';
import readme from '../../../common/views/components/FreeSticker/README.md';
import FreeSticker from '../../../common/views/components/FreeSticker/FreeSticker';

const stories = storiesOf('Components', module);

stories.add('FreeSticker', () => <FreeSticker />, {
  info: readme,
});
