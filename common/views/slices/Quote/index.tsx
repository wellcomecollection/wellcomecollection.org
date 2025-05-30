import { SliceComponentProps } from '@prismicio/react';
import { FunctionComponent } from 'react';

import { QuoteSlice as RawQuoteSlice } from '@weco/common/prismicio-types';
import SpacingComponent from '@weco/common/views/components/styled/SpacingComponent';
import {
  defaultContext,
  LayoutWidth,
  SliceZoneContext,
} from '@weco/content/components/Body';
import Quote from '@weco/content/components/Quote';
import { transformQuoteSlice } from '@weco/content/services/prismic/transformers/body';

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
