import { storiesOf } from '@storybook/react';
import FeaturedCard from '../../../common/views/components/FeaturedCard/FeaturedCard';
import FeaturedCardReadme from '../../../common/views/components/FeaturedCard/README.md';
import Card from '../../../common/views/components/Card/Card';
import CardReadme from '../../../common/views/components/Card/README.md';
import CompactCard from '../../../common/views/components/CompactCard/CompactCard';
import CompactCardReadme from '../../../common/views/components/CompactCard/README.md';
import {UiImage} from  '../../../common/views/components/Images/Images';
import {image, singleLineOfText} from '../content';

const imageProps = image();

const FeaturedCardExample = () => <FeaturedCard
  url={'https://wellcomecollection.org'}
  title={'Wellcome Collection'}
  promoType={'ExamplePromo'}
  description={singleLineOfText(10, 25)}
  Image={<UiImage {...imageProps} />}
  DateInfo={null}
  Tags={null}
/>;
const CardExample = () => <Card
  url={'https://wellcomecollection.org'}
  title={'Wellcome Collection'}
  promoType={'ExamplePromo'}
  description={singleLineOfText(10, 25)}
  Image={<UiImage {...imageProps} />}
  DateInfo={null}
  Tags={null}
/>;
const CompactCardExample = () => <CompactCard
  url={'https://wellcomecollection.org'}
  title={'Wellcome Collection'}
  promoType={'ExamplePromo'}
  description={singleLineOfText(10, 25)}
  Image={<UiImage {...imageProps} />}
  DateInfo={null}
  Tags={null}
/>;

const stories = storiesOf('Components', module);
stories
  .add('Cards: Featured', FeaturedCardExample, {info: FeaturedCardReadme})
  .add('Cards: Default', CardExample, {info: CardReadme})
  .add('Cards: Compact', CompactCardExample, {info: CompactCardReadme});
