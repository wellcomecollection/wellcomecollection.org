import { CaptionedImage } from '../Images/Images';
import PrismicHtmlBlock from '../PrismicHtmlBlock/PrismicHtmlBlock';
import { CaptionedImage as CaptionedImageType } from '../../../model/captioned-image';
import { HTMLString } from '../../../services/prismic/types';
import { FunctionComponent } from 'react';

type Props = {
  items: {
    title: string;
    subtitle: string;
    image: CaptionedImageType;
    description: HTMLString;
  }[];
};
const DeprecatedImageList: FunctionComponent<Props> = ({ items }: Props) => {
  return (
    <>
      {items.map((item, i) => (
        <div className="body-text" key={i}>
          <h2>{item.title}</h2>
          <CaptionedImage
            {...item.image}
            sizesQueries="(min-width: 1540px) 1402px, (min-width: 600px) 92.39vw, 100vw"
          />
          <PrismicHtmlBlock html={item.description} />
        </div>
      ))}
    </>
  );
};

export default DeprecatedImageList;
