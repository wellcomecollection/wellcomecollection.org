// @flow
import {Fragment} from 'react';
import type ImageViewer2 from '../ImageViewer/ImageViewer2';
import type Image from '../Image/Image';
import type {Work} from '../../../model/work';
import licenses from '../../../data/licenses';

type Props = {|
  work: Work,
  Embed: ImageViewer2 | Image
|}

const WorkEmbed = ({
  work,
  Embed
}: Props) => {
  const license = work.thumbnail && work.thumbnail.license.licenseType;
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
            <Fragment>{Embed}</Fragment>
          </div>
        </div>
        <div style={{
          marginTop: 'auto',
          paddingLeft: '12px',
          paddingRight: '12px',
          paddingBottom: '12px'
        }}>
          {work.title}
          {work.creators.length > 0 &&
            work.creators.map(creator => creator.label).join(', ')
          }
          {work.credit && <a href={`https://wellcomecollection.org/works/${work.id}`}>{work.credit}</a>}
          {license && <a href={licenses[license].url}>{license}</a>}
        </div>
      </div>
    </Fragment>
  );
};

export default WorkEmbed;
