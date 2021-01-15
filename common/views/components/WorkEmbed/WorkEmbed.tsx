import ImageViewer from '../ImageViewer/ImageViewer';
import { getDigitalLocationOfType } from '@weco/common/utils/works';
import {
  iiifImageTemplate,
  convertImageUri,
  convertIiifUriToInfoUri,
} from '../../../utils/convert-image-uri';
import { Work } from '../../../model/catalogue';
import { FunctionComponent } from 'react';

type Props = {
  work: Work;
};

const WorkEmbed: FunctionComponent<Props> = ({ work }: Props) => {
  const iiifImageLocation = getDigitalLocationOfType(work, 'iiif-image');
  const iiifInfoUrl = iiifImageLocation && iiifImageLocation.url;
  const iiifImage = iiifInfoUrl && iiifImageTemplate(iiifInfoUrl);
  const imageUrl = iiifImage && iiifImage({ size: '800,' });
  const imageInfoUrl =
    imageUrl && convertIiifUriToInfoUri(convertImageUri(imageUrl, 'full'));

  if (imageInfoUrl && iiifImage) {
    return (
      <div
        className="enhanced"
        style={{
          display: 'flex',
          flexDirection: 'column',
          height: '100vh',
          maxWidth: '100vw',
          position: 'relative',
        }}
      >
        <div
          style={{
            flexGrow: 1,
            position: 'relative',
            marginBottom: '30px',
          }}
        >
          <div
            style={{
              position: 'absolute',
              top: 0,
              height: '100%',
              maxWidth: '100vw',
              width: '100%',
              textAlign: 'center',
            }}
          >
            <ImageViewer
              infoUrl={imageInfoUrl}
              id={work.id}
              lang={null}
              width={800}
              urlTemplate={iiifImage}
              alt=""
              setShowZoomed={false}
              rotation={0}
            />
          </div>
        </div>
      </div>
    );
  } else {
    return null;
  }
};

export default WorkEmbed;
