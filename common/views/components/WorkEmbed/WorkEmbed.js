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
        maxHeight: '95vh',
        maxWidth: '100vw',
        textAlign: 'center',
        position: 'relative'
      }}>
        <Fragment>
          {Embed}
        </Fragment>
        <div>
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
