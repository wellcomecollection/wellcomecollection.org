// @flow
import {Fragment} from 'react';
import WorkCredit from '../WorkCredit/WorkCredit';
import {UiImage} from '../Images/Images';
import {iiifImageTemplate} from '../../../utils/convert-image-uri';
import type {Work} from '../../../model/work';

type Props = {|
  work: Work
|}

const WorkImage = ({
  work
}: Props) => {
  const [iiifImageLocation] = work.items.map(
    item => item.locations.find(
      location => location.locationType === 'iiif-image'
    )
  );
  const iiifInfoUrl = iiifImageLocation && iiifImageLocation.url;
  const iiifImage = iiifImageTemplate(iiifInfoUrl);
  const imageUrl = iiifImage({size: '800,'});

  return (
    <Fragment>
      <a href={`https://wellcomecollection.org/works/${work.id}`}>
        <UiImage
          contentUrl={imageUrl}
          width={800}
          height={0}
          alt=''
          tasl={{
            title: work.title,
            author: work.creators.map(creator => creator.label).join(', '),
            copyrightHolder: null,
            copyrightLink: null,
            sourceLink: work.credit,
            sourceName: `https://wellcomecollection.org/works/${work.id}`,
            license: work.thumbnail && work.thumbnail.license.licenseType
          }}
          sizesQueries=''
          showTasl={false} />
      </a>
      <WorkCredit work={work} />
    </Fragment>
  );
};

export default WorkImage;
