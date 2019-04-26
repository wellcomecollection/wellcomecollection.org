import { storiesOf } from '@storybook/react';
import Label from '../../../common/views/components/Label/Label';
import Readme from '../../../common/views/components/Label/README.md';
import { boolean } from '@storybook/addon-knobs/react';

const LabelExample = () => {
  const hasLink = boolean('Has link?', false);
  return (
    <Label
      label={
        hasLink
          ? { url: '/', text: 'Audio described' }
          : { url: null, text: 'Audio described' }
      }
    />
  );
};

const stories = storiesOf('Components', module);
stories.add('Label', LabelExample, { readme: { sidebar: Readme } });
