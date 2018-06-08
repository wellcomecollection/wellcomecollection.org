// @flow
import {Fragment} from 'react';
import WorkCredit from '../WorkCredit/WorkCredit';
import ImageViewer2 from '../ImageViewer/ImageViewer2';
import {iiifImageTemplate} from '../../../utils/convert-image-uri';
import type {Work} from '../../../model/work';

type Props = {|
  work: Work
|}

const WorkEmbed = ({
  work
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
        display: 'flex',
        flexDirection: 'column',
        height: '100vh',
        maxWidth: '100vw',
        position: 'relative'
      }}>
        <div style={{
          flexGrow: 1,
          position: 'relative',
          marginBottom: '30px'
        }}>
          <div style={{
            position: 'absolute',
            top: 0,
            height: '100%',
            maxWidth: '100vw',
            width: '100%',
            textAlign: 'center'
          }}>
            <Fragment>
              <ImageViewer2
                contentUrl={imageUrl}
                id={work.id}
                width={800}
                trackTitle={work.title}
              />
            </Fragment>
          </div>
        </div>
        <div style={{
          marginTop: 'auto',
          paddingLeft: '12px',
          paddingRight: '12px',
          paddingBottom: '12px'
        }}>
          <WorkCredit work={work} />
        </div>
      </div>
    </Fragment>
  );
};

export default WorkEmbed;
