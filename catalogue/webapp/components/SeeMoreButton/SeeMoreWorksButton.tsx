import {
  toLink,
  WorksProps,
  WorksPropsSource,
} from '@weco/common/views/components/WorksLink/WorksLink';
import { PaletteColor } from '@weco/common/views/themes/config';
import { FC } from 'react';
import { SeeMoreButton } from './SeeMoreButton';

type Props = {
  totalResults: number;
  leadingColor: PaletteColor;
  props: Partial<WorksProps>;
  source: WorksPropsSource;
};

export const SeeMoreWorksButton: FC<Props> = ({
  totalResults,
  leadingColor,
  props,
  source,
}) => (
  <SeeMoreButton
    text={`All works (${totalResults})`}
    link={toLink(props, source)}
    leadingColor={leadingColor}
  />
);
