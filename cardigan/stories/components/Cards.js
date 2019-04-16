import { storiesOf } from '@storybook/react';
import CompactCard from '../../../common/views/components/CompactCard/CompactCard';
import CompactCardReadme from '../../../common/views/components/CompactCard/README.md';
import { UiImage } from '../../../common/views/components/Images/Images';
import { image, singleLineOfText } from '../content';

const imageProps = image();
const labelList = { labels: [{ text: 'Study day' }, { text: 'Schools' }] };

const CompactCardExample = () => (
  <CompactCard
    url={'https://wellcomecollection.org'}
    title={'Wellcome Collection'}
    description={singleLineOfText(10, 25)}
    Image={<UiImage {...imageProps} />}
    DateInfo={null}
    Tags={null}
    labels={labelList}
  />
);

const stories = storiesOf('Components', module);
stories.add('CompactCard', CompactCardExample, { info: CompactCardReadme });
