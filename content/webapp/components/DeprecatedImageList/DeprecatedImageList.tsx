import CaptionedImage from '../CaptionedImage/CaptionedImage';
import PrismicHtmlBlock from '@weco/common/views/components/PrismicHtmlBlock/PrismicHtmlBlock';
import { CaptionedImage as CaptionedImageType } from '@weco/common/model/captioned-image';
import { FunctionComponent } from 'react';
import * as prismic from '@prismicio/client';

export type Props = {
  items: {
    title: string;
    subtitle: string;
    image: CaptionedImageType;
    description: prismic.RichTextField;
  }[];
};
const DeprecatedImageList: FunctionComponent<Props> = ({ items }: Props) => {
  return (
    <>
      {items.map((item, i) => (
        <div className="body-text" key={i}>
          <h2>{item.title}</h2>
          <CaptionedImage {...item.image} />
          <PrismicHtmlBlock html={item.description} />
        </div>
      ))}
    </>
  );
};

export default DeprecatedImageList;
