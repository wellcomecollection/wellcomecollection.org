import { FunctionComponent, ReactElement } from 'react';
import PrismicImage from '@weco/common/views/components/PrismicImage/PrismicImage';
import MediaObjectBase, {
  HasImageProps,
} from '../MediaObjectBase/MediaObjectBase';
import { getCrop, ImageType } from '@weco/common/model/image';
import PrismicHtmlBlock from '@weco/common/views/components/PrismicHtmlBlock/PrismicHtmlBlock';
import styled from 'styled-components';
import { grid, font } from '@weco/common/utils/classnames';
import * as prismicT from '@prismicio/types';

export type Props = {
  title: string;
  text?: prismicT.RichTextField;
  image: ImageType;
};

type ImageWrapperProp = {
  hasImage: boolean;
};

const grid12 = grid({ s: 12, m: 12, l: 12, xl: 12 });

const ImageWrapper = styled.div.attrs<ImageWrapperProp>(props => {
  if (props.hasImage) {
    return {
      className: grid({ s: 2, m: 2, l: 2, xl: 2 }),
    };
  }
  return {
    className: grid12,
  };
})<ImageWrapperProp>``;

const TextWrapper = styled.div.attrs<HasImageProps>(props => {
  if (props.hasImage) {
    return {
      className: grid({ s: 10, m: 10, l: 10, xl: 10 }),
    };
  }
  return {
    className: grid12,
  };
})<HasImageProps>``;

const TitleWrapper = styled.div.attrs({
  className: `card-link__title ${font('wb', 4)}`,
})``;

export const MediaObject: FunctionComponent<Props> = ({
  title,
  text,
  image,
}: Props): ReactElement<Props> => {
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
      color={undefined}
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
