// @flow
import WorkEmbed from './WorkEmbed';
import ImageViewer2 from '../ImageViewer/ImageViewer2';
import {iiifImageTemplate} from '../../../utils/convert-image-uri';
import type {Work} from '../../../model/work';

type Props = {|
  work: Work
|}

const WithImageViewer = ({work}: Props) => {
  const [iiifImageLocation] = work.items.map(
    item => item.locations.find(
      location => location.locationType === 'iiif-image'
    )
  );
  const iiifInfoUrl = iiifImageLocation && iiifImageLocation.url;
  const iiifImage = iiifImageTemplate(iiifInfoUrl);
  const imageUrl = iiifImage({width: 800});

  return (
    <WorkEmbed Embed={
      <ImageViewer2
        contentUrl={imageUrl}
        id={work.id}
        width={800}
        trackTitle={work.title}
      />} />
  );
};

export default WithImageViewer;
