import {Fragment} from 'react';
import { storiesOf } from '@storybook/react';
import MoreLink from '../../../common/views/components/Links/MoreLink/MoreLink';
import SecondaryLink from '../../../common/views/components/Links/SecondaryLink/SecondaryLink';
import {sized} from '../../../common/utils/style';

const stories = storiesOf('Components', module);
stories.add('Links: More', () => (
  <Fragment>
    <h2 className='h2'>Link</h2>
    <MoreLink url={`#`} name={`View all exhibitions`} />
    <hr style={{
      marginTop: sized(3),
      marginBottom: sized(3)
    }} />
    <h2 className='h2'>Internal target</h2>
    <MoreLink url={`#`} name={`See all dates`} isJumpLink={true} />
  </Fragment>
));
