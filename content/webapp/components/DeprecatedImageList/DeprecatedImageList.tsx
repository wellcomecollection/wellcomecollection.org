import { CaptionedImage } from '@weco/common/views/components/Images/Images';
import PrismicHtmlBlock from '@weco/common/views/components/PrismicHtmlBlock/PrismicHtmlBlock';
import { CaptionedImage as CaptionedImageType } from '@weco/common/model/captioned-image';
import { HTMLString } from '@weco/common/services/prismic/types';
import { FunctionComponent } from 'react';

export type Props = {
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
