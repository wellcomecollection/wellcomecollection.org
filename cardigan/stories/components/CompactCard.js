import { storiesOf } from '@storybook/react';
import CompactCard from '../../../common/views/components/CompactCard/CompactCard';
import Readme from '../../../common/views/components/CompactCard/README.md';
import { UiImage } from '../../../common/views/components/Images/Images';
import { squareImage, singleLineOfText } from '../content';

const imageProps = squareImage();
const primaryLabelList = [{ text: 'Study day' }, { text: 'Schools' }];
const secondaryLabelList = [{ text: 'Speech-to-text' }];

const CompactCardExample = () => (
  <CompactCard
    url={'https://wellcomecollection.org'}
    title={'Wellcome Collection'}
    description={singleLineOfText(10, 25)}
    Image={<UiImage {...imageProps} tasl={null} />}
    DateInfo={null}
    Tags={null}
    primaryLabels={primaryLabelList}
    secondaryLabels={secondaryLabelList}
    xOfY={[1, 1]}
  />
);

const stories = storiesOf('Components', module);
stories.add('CompactCard', CompactCardExample, { readme: { sidebar: Readme } });
