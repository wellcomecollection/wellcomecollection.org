// @flow
import WorkEmbed from './WorkEmbed';
import Image from '../Image/Image';
import {iiifImageTemplate} from '../../../utils/convert-image-uri';
import type {Work} from '../../../model/work';

type Props = {|
  work: Work
|}

const withImageViewer = ({work}: Props) => {
  const [iiifImageLocation] = work.items.map(
    item => item.locations.find(
      location => location.locationType === 'iiif-image'
    )
  );
  const iiifInfoUrl = iiifImageLocation && iiifImageLocation.url;
  const iiifImage = iiifImageTemplate(iiifInfoUrl);
  const imageUrl = iiifImage({width: 800});

  return (
    <WorkEmbed work={work} Embed={
      <Image
        extraClasses='margin-v-auto width-auto inherit-max-height'
        width={800}
        defaultSize={800}
        contentUrl={imageUrl}
        lazyload={false}
        sizesQueries='(min-width: 860px) 800px, calc(92.59vw + 22px)'
        alt='' />
    } />
  );
};

export default withImageViewer;
