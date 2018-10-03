// @flow
import {CaptionedImage} from '../Images/Images';
import PrismicHtmlBlock from '../PrismicHtmlBlock/PrismicHtmlBlock';
import type {CaptionedImage as CaptionedImageType} from '../../model/captioned-image';
import type {HTMLString} from '../../service/prismic/types';

type Props = {|
  items: {|
    title: string,
    subtitle: string,
    image: CaptionedImageType,
    description: HTMLString
  |}
|}
const DeprecatedImageList = ({
  items
}: Props) => {
  return (
    items.map((item, i) => (
      <div className='body-text' key={i}>
        <h2>{item.title}</h2>
        <CaptionedImage {...item.image} />
        <PrismicHtmlBlock html={item.description} />
      </div>
    ))
  );
};

export default DeprecatedImageList;
