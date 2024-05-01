import { Content } from '@prismicio/client';
import { SliceComponentProps } from '@prismicio/react';

/**
 * Props for `GuideTextItem`.
 */
export type GuideTextItemProps =
  SliceComponentProps<Content.GuideTextItemSlice>;

/**
 * Component for "GuideTextItem" Slices.
 */
const GuideTextItem = ({ slice }: GuideTextItemProps): JSX.Element => {
  return (
    <section
      data-slice-type={slice.slice_type}
      data-slice-variation={slice.variation}
    >
      Placeholder component for guide_text_item (variation: {slice.variation})
      Slices
    </section>
  );
};

export default GuideTextItem;
