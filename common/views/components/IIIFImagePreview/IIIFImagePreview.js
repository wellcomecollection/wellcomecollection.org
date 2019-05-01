// @flow
import { iiifImageTemplate } from '../../../utils/convert-image-uri';
import { classNames } from '../../../utils/classnames';
import Image from '../Image/Image';

type Props = {|
  id: string,
  title: string,
  iiifUrl: string,
  width?: number,
|};

const IIIFImagePreview = ({ id, title, iiifUrl, width = 800 }: Props) => {
  const imageContentUrl = iiifImageTemplate(iiifUrl)({ size: `${width},` });
  return (
    <div>
      <div
        id={`work-media-${id}`}
        className={classNames({
          'row font-white work-media': true,
          'bg-black': true,
        })}
      >
        <Image
          width={width}
          contentUrl={imageContentUrl}
          lazyload={false}
          sizesQueries="(min-width: 860px) 800px, calc(92.59vw + 22px)"
          alt=""
          defaultSize={800}
          extraClasses="margin-h-auto width-auto full-height full-max-width block"
        />
      </div>
    </div>
  );
};

export default IIIFImagePreview;
