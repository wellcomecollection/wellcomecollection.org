import { SliceComponentProps } from '@prismicio/react';
import { FunctionComponent } from 'react';

import { TitledTextListSlice as RawTitledTextListSlice } from '@weco/common/prismicio-types';
import ConditionalWrapper from '@weco/common/views/components/ConditionalWrapper';
import { ContaineredLayout } from '@weco/common/views/components/Layout';
import SpacingComponent from '@weco/common/views/components/styled/SpacingComponent';
import { transformTitledTextListSlice } from '@weco/content/services/prismic/transformers/body';
import {
  defaultContext,
  SliceZoneContext,
} from '@weco/content/views/components/Body';
import TitledTextList from '@weco/content/views/components/TitledTextList';

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
      <ConditionalWrapper
        condition={!!options.gridSizes}
        wrapper={children => (
          <ContaineredLayout gridSizes={options.gridSizes!}>
            {children}
          </ContaineredLayout>
        )}
      >
        <TitledTextList {...transformedSlice.value} />
      </ConditionalWrapper>
    </SpacingComponent>
  );
};

export default TitledTextListSlice;
