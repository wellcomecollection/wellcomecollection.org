// @flow
import type { Props as ImageProps } from '@weco/common/views/components/Image/Image';
import Image from '@weco/common/views/components/Image/Image';

type Props = {|
  id: string,
  image: ImageProps,
  onClick: () => void,
|};

const ImageCard = ({ id, image, onClick }: Props) => {
  return (
    <a
      href={`#${id}`}
      onClick={onClick}
      id={id}
      data-component="ImageCard"
      className={`promo promo--work`}
    >
      <div
        className={`promo__image-container promo__image-container--constrained`}
      >
        <Image
          {...image}
          lazyload={true}
          sizesQueries={`(min-width: 1340px) 178px, (min-width: 960px) calc(25vw - 52px), (min-width: 600px) calc(33.24vw - 43px), calc(50vw - 27px)`}
          defaultSize={180}
        />
      </div>
    </a>
  );
};

export default ImageCard;
