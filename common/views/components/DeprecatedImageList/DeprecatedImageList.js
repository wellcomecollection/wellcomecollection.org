// @flow
import {CaptionedImage} from '../Images/Images';
import PrismicHtmlBlock from '../PrismicHtmlBlock/PrismicHtmlBlock';
import type {CaptionedImage as CaptionedImageType} from '../../../model/captioned-image';
import type {HTMLString} from '../../../services/prismic/types';

type Props = {|
  items: {|
    title: string,
    subtitle: string,
    image: CaptionedImageType,
    description: HTMLString
  |}[]
|}
const DeprecatedImageList = ({
  items
}: Props) => {
  return (
    // Missing type annotation for U.
    // Not sure why I am getting the above, don't really care as this is deprecated.
    // $FlowFixMe
    items.map((item, i) => (
      <div className='body-text' key={i}>
        <h2>{item.title}</h2>
        <CaptionedImage
          {...item.image}
          sizesQueries='(min-width: 1540px) 1402px, (min-width: 600px) 92.39vw, 100vw'
        />
        <PrismicHtmlBlock html={item.description} />
      </div>
    ))
  );
};

export default DeprecatedImageList;
