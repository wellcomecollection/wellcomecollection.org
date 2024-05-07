import { Content } from '@prismicio/client';
import { SliceComponentProps } from '@prismicio/react';

/**
 * Props for `GuideStop`.
 */
export type GuideStopProps = SliceComponentProps<Content.GuideStopSlice>;

/**
 * Component for "GuideStop" Slices.
 */
const GuideStop = ({ slice }: GuideStopProps): JSX.Element => {
  return (
    <section
      data-slice-type={slice.slice_type}
      data-slice-variation={slice.variation}
    >
      Placeholder component for guide_stop (variation: {slice.variation}) Slices
    </section>
  );
};

export default GuideStop;
