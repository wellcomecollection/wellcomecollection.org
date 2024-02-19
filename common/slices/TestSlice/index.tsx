import { Content } from '@prismicio/client';
import { SliceComponentProps } from '@prismicio/react';

/**
 * Props for `TestSlice`.
 */
export type TestSliceProps = SliceComponentProps<Content.TestSliceSlice>;

/**
 * Component for "TestSlice" Slices.
 */
const TestSlice = ({ slice }: TestSliceProps): JSX.Element => {
  return (
    <section
      data-slice-type={slice.slice_type}
      data-slice-variation={slice.variation}
    >
      Placeholder component for test_slice (variation: {slice.variation}) Slices
    </section>
  );
};

export default TestSlice;
