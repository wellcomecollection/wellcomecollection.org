// @flow
import {Fragment} from 'react';
import {iiifImageTemplate} from '../../../utils/convert-image-uri';
import ImageViewer2 from '../ImageViewer/ImageViewer2';
import Image from '../Image/Image';
import type {Work} from '../../../model/work';

type Props = {|
  work: Work,
  withViewer: boolean
|}

const WorkEmbed = ({
  work,
  withViewer
}: Props) => {
  const [iiifImageLocation] = work.items.map(
    item => item.locations.find(
      location => location.locationType === 'iiif-image'
    )
  );
  const iiifInfoUrl = iiifImageLocation && iiifImageLocation.url;
  const iiifImage = iiifImageTemplate(iiifInfoUrl);
  const imageUrl = iiifImage({width: 800});

  return (
    <Fragment>
      <div className='enhanced' style={{
        maxHeight: '95vh',
        maxWidth: '100vw',
        textAlign: 'center',
        position: 'relative'
      }}>
        <Fragment>
          {withViewer && <ImageViewer2
            contentUrl={imageUrl}
            id={work.id}
            width={800}
            trackTitle={work.title}
          />}

          {!withViewer && <Image
            extraClasses='margin-v-auto width-auto inherit-max-height'
            width={800}
            defaultSize={800}
            contentUrl={imageUrl}
            lazyload={false}
            sizesQueries='(min-width: 860px) 800px, calc(92.59vw + 22px)'
            alt='' />}
        </Fragment>
      </div>
    </Fragment>
  );
};

export default WorkEmbed;
