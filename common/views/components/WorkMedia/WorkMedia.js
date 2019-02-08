// @flow
import Control from '../Buttons/Control/Control';
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
  isV2?: boolean,
|};

const WorkMedia = ({
  id,
  title,
  iiifUrl,
  width = 800,
  isV2 = false,
}: Props) => {
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
          'work-media--v2': isV2,
          'bg-black': !isV2,
        })}
      >
        <Control
          type="dark"
          extraClasses="scroll-to-info js-scroll-to-info js-work-media-control flush-container-right"
          url="#work-info"
          trackingEvent={{
            category: 'Control',
            action: 'scroll to work info',
            label: id,
          }}
          icon="chevron"
          text="Scroll to info"
        />
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
