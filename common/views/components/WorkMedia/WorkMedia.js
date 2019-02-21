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

const WorkMedia = ({ id, title, iiifUrl, width = 800 }: Props) => {
  const imageContentUrl = iiifImageTemplate(iiifUrl)({ size: `${width},` });
  const imageInfoUrl = convertIiifUriToInfoUri(
    convertImageUri(imageContentUrl, 'full', false)
  );
  return (
    <div>
      <div
        id={`work-media-${id}`}
        className={classNames({
          'row font-white work-media js-work-media': true,
          'bg-black': true,
        })}
      >
        {/*  TODO pass <Image> here rather than pass props down? */}
        <ImageViewer
          infoUrl={imageInfoUrl}
          contentUrl={imageContentUrl}
          id={id}
          width={width}
        />
      </div>
    </div>
  );
};

export default WorkMedia;
