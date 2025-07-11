import { Content } from '@prismicio/client';
import { SliceComponentProps } from '@prismicio/react';
import { FunctionComponent } from 'react';

import { transformGuideTextItemSlice } from '@weco/content/services/prismic/transformers/exhibition-texts';
import TextItem from '@weco/content/views/components/GuideTextItem';

export type GuideTextItemProps =
  SliceComponentProps<Content.GuideTextItemSlice>;

const GuideTextItem: FunctionComponent<GuideTextItemProps> = ({
  slice,
  index,
}) => {
  const { additional_notes: additionalNotes, ...transformedSlice } =
    transformGuideTextItemSlice(slice);

  return (
    <TextItem
      key={index}
      {...transformedSlice}
      additionalNotes={additionalNotes}
    />
  );
};

export default GuideTextItem;
