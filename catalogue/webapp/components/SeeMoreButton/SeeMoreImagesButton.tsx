import {
  toLink,
  ImagesProps,
  ImagesPropsSource,
} from '@weco/common/views/components/ImagesLink/ImagesLink';
import { PaletteColor } from '@weco/common/views/themes/config';
import { FC } from 'react';
import { SeeMoreButton } from './SeeMoreButton';

type Props = {
  totalResults: number;
  leadingColor: PaletteColor;
  props: Partial<ImagesProps>;
  source: ImagesPropsSource;
};

const SeeMoreImagesButton: FC<Props> = ({
  totalResults,
  leadingColor,
  props,
  source,
}) => (
  <SeeMoreButton
    text={`All images (${totalResults})`}
    link={toLink(props, source)}
    leadingColor={leadingColor}
  />
);

export default SeeMoreImagesButton;
