import { storiesOf } from '@storybook/react';
import Label from '../../../common/views/components/Label/Label';
import Readme from '../../../common/views/components/Label/README.md';

const LabelExample = () => {
  return <Label label={{ text: 'Audio described' }} />;
};

const stories = storiesOf('Components', module);
stories.add('Label', LabelExample, { readme: { sidebar: Readme } });
