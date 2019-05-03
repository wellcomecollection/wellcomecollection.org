// @flow
import {
  iiifImageTemplate,
  convertImageUri,
  convertIiifUriToInfoUri,
} from '../../../utils/convert-image-uri';
import ImageViewer from '../ImageViewer/ImageViewer';
import { classNames } from '../../../utils/classnames';

type Props = {|
  id: string,
  title: string,
  iiifUrl: string,
  width?: number,
|};

const IIIFImagePreview = ({ id, title, iiifUrl, width = 800 }: Props) => {
  const imageContentUrl = iiifImageTemplate(iiifUrl)({ size: `${width},` });
  const imageInfoUrl = convertIiifUriToInfoUri(
    convertImageUri(imageContentUrl, 'full', false)
  );

  console.log(imageContentUrl);

  return (
    <div>
      <div
        id={`work-media-${id}`}
        className={classNames({
          'row font-white work-media': true,
          'bg-black': true,
        })}
      >
        <ImageViewer
          id={id}
          infoUrl={imageInfoUrl}
          contentUrl={imageContentUrl}
          imageService={null}
          canvasOcr={null}
          lang={'eng'}
          width={width}
        />
      </div>
    </div>
  );
};

export default IIIFImagePreview;
