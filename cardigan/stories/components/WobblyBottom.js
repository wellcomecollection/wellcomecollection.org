import {Fragment} from 'react';
import { storiesOf } from '@storybook/react';
import WobblyBottom from '../../../common/views/components/WobblyBottom/WobblyBottom';
import {UiImage} from '../../../common/views/components/Images/Images';
import Readme from '../../../common/views/components/WobblyBottom/README.md';
import {sized} from '../../../common/utils/style';
import {image} from '../content';

const stories = storiesOf('Components', module);
const WobblyBottomExample = () => {
  return (
    <Fragment>
      <h2 className='h2'>An image</h2>
      <WobblyBottom color='cream'>
        <UiImage {...image()} isFull={true} />
      </WobblyBottom>

      <hr style={{
        marginTop: sized(3),
        marginBottom: sized(3)
      }} />

      <h2>A headline</h2>
      <WobblyBottom color='cream'>
        <h1 className='h1'>Old man yells at cloud</h1>
      </WobblyBottom>
    </Fragment>
  );
};

stories
  .add('Wobbly bottom', WobblyBottomExample, {
    info: Readme
  });
