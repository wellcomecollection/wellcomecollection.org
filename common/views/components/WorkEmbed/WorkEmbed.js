// @flow
import {Fragment} from 'react';
import type ImageViewer2 from '../ImageViewer/ImageViewer2';
import type Image from '../Image/Image';

type Props = {|
  Embed: ImageViewer2 | Image
|}

const WorkEmbed = ({
  Embed
}: Props) => {
  return (
    <Fragment>
      <div className='enhanced' style={{
        maxHeight: '95vh',
        maxWidth: '100vw',
        textAlign: 'center',
        position: 'relative'
      }}>
        <Fragment>
          {Embed}
        </Fragment>
      </div>
    </Fragment>
  );
};

export default WorkEmbed;
