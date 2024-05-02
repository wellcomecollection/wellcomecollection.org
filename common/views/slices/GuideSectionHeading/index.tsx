import { Content } from '@prismicio/client';
import { SliceComponentProps } from '@prismicio/react';

/**
 * Props for `GuideSectionHeading`.
 */
export type GuideSectionHeadingProps =
  SliceComponentProps<Content.GuideSectionHeadingSlice>;

/**
 * Component for "GuideSectionHeading" Slices.
 */
const GuideSectionHeading = ({
  slice,
}: GuideSectionHeadingProps): JSX.Element => {
  return (
    <section
      data-slice-type={slice.slice_type}
      data-slice-variation={slice.variation}
    >
      Placeholder component for guide_section_heading (variation:{' '}
      {slice.variation}) Slices
    </section>
  );
};

export default GuideSectionHeading;
