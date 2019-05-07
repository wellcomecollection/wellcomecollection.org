// @flow
import {
  iiifImageTemplate,
  convertImageUri,
  convertIiifUriToInfoUri,
} from '../../../utils/convert-image-uri';
import ImageViewer from '../ImageViewer/ImageViewer';
import { classNames } from '../../../utils/classnames';
import { imageSizes } from '../../../utils/image-sizes';

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

  const srcSet = imageSizes(2048)
    .map(w => {
      return `${iiifImageTemplate(iiifUrl)({ size: `${w},` })} ${w}w`;
    })
    .join(',');

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
          src={imageContentUrl}
          srcSet={srcSet}
          canvasOcr={null}
          lang={'eng'}
          width={width}
        />
      </div>
    </div>
  );
};

export default IIIFImagePreview;
