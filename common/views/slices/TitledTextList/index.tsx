import { SliceComponentProps } from '@prismicio/react';
import { FunctionComponent } from 'react';

import { TitledTextListSlice as RawTitledTextListSlice } from '@weco/common/prismicio-types';
import SpacingComponent from '@weco/common/views/components/styled/SpacingComponent';
import {
  defaultContext,
  LayoutWidth,
  SliceZoneContext,
} from '@weco/content/views/components/Body';
import TitledTextList from '@weco/content/views/components/TitledTextList';
import { transformTitledTextListSlice } from '@weco/content/services/prismic/transformers/body';

export type TitledTextListProps = SliceComponentProps<
  RawTitledTextListSlice,
  SliceZoneContext
>;

const TitledTextListSlice: FunctionComponent<TitledTextListProps> = ({
  slice,
  context,
}) => {
  const options = { ...defaultContext, ...context };
  const transformedSlice = transformTitledTextListSlice(slice);
  return (
    <SpacingComponent $sliceType={transformedSlice.type}>
      <LayoutWidth width={options.minWidth}>
        <TitledTextList {...transformedSlice.value} />
      </LayoutWidth>
    </SpacingComponent>
  );
};

export default TitledTextListSlice;
