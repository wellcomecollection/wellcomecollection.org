import { SliceComponentProps } from '@prismicio/react';
import { FunctionComponent } from 'react';

import { QuoteSlice as RawQuoteSlice } from '@weco/common/prismicio-types';
import SpacingComponent from '@weco/common/views/components/styled/SpacingComponent';
import { transformQuoteSlice } from '@weco/content/services/prismic/transformers/body';
import {
  defaultContext,
  LayoutWidth,
  SliceZoneContext,
} from '@weco/content/views/components/Body';
import Quote from '@weco/content/views/components/Quote';

export type QuoteSliceProps = SliceComponentProps<
  RawQuoteSlice,
  SliceZoneContext
>;

const QuoteSlice: FunctionComponent<QuoteSliceProps> = ({ slice, context }) => {
  const transformedSlice = transformQuoteSlice(slice);
  const options = { ...defaultContext, ...context };

  return (
    <SpacingComponent $sliceType={transformedSlice.type}>
      <LayoutWidth width={options.minWidth}>
        <Quote {...transformedSlice.value} />
      </LayoutWidth>
    </SpacingComponent>
  );
};

export default QuoteSlice;
