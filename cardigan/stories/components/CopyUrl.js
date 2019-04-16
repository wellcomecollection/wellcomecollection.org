import { storiesOf } from '@storybook/react';
import CopyUrl from '../../../common/views/components/CopyUrl/CopyUrl';
import Readme from '../../../common/views/components/CopyUrl/README.md';

const CopyUrlExample = () => {
  const id = 't59c279p';

  return <CopyUrl id={id} url={`https://wellcomecollection.org/works/${id}`} />;
};

const stories = storiesOf('Components', module);
stories.add('CopyUrl', CopyUrlExample, { info: Readme });
