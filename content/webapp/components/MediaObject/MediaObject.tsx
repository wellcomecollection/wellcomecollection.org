import { FunctionComponent } from 'react';
import PrismicImage from '@weco/common/views/components/PrismicImage/PrismicImage';
import MediaObjectBase, {
  HasImageProps,
} from '../MediaObjectBase/MediaObjectBase';
import { getCrop, ImageType } from '@weco/common/model/image';
import PrismicHtmlBlock from '@weco/common/views/components/PrismicHtmlBlock/PrismicHtmlBlock';
import styled from 'styled-components';
import { grid, font } from '@weco/common/utils/classnames';
import * as prismic from '@prismicio/client';
import { gridSize12 } from '@weco/common/views/components/Layout12/Layout12';

export type Props = {
  title: string;
  text?: prismic.RichTextField;
  image: ImageType;
};

type ImageWrapperProp = {
  $hasImage: boolean;
};

const ImageWrapper = styled.div.attrs<ImageWrapperProp>(props => ({
  className: props.$hasImage
    ? grid({ s: 2, m: 2, l: 2, xl: 2 })
    : grid(gridSize12),
}))<ImageWrapperProp>``;

const TextWrapper = styled.div.attrs<HasImageProps>(props => ({
  className: props.$hasImage
    ? grid({ s: 10, m: 10, l: 10, xl: 10 })
    : grid(gridSize12),
}))<HasImageProps>``;

const TitleWrapper = styled.div.attrs({
  className: font('wb', 4),
})``;

export const MediaObject: FunctionComponent<Props> = ({
  title,
  text,
  image,
}) => {
  const squareImage = getCrop(image, 'square');
  const ImageComponent = squareImage && (
    <PrismicImage
      image={{
        // We intentionally omit the alt text on promos, so screen reader
        // users don't have to listen to the alt text before hearing the
        // title of the item in the list.
        //
        // See https://github.com/wellcomecollection/wellcomecollection.org/issues/6007
        ...squareImage,
        alt: '',
      }}
      sizes={{
        xlarge: 1 / 10,
        large: 1 / 10,
        medium: 1 / 10,
        small: 1 / 10,
      }}
      quality="low"
    />
  );

  const description = text && <PrismicHtmlBlock html={text} />;
  return (
    <MediaObjectBase
      title={title}
      Image={ImageComponent}
      partDescription="Part"
      description={description}
      primaryLabels={[]}
      secondaryLabels={[]}
      OverrideImageWrapper={ImageWrapper}
      OverrideTextWrapper={TextWrapper}
      OverrideTitleWrapper={TitleWrapper}
    />
  );
};

export default MediaObject;
