import { Content } from '@prismicio/client';
import { SliceComponentProps } from '@prismicio/react';
import { FunctionComponent } from 'react';

import TextItem from '@weco/common/views/components/GuideTextItem';
import { transformGuideTextItemSlice } from '@weco/content/services/prismic/transformers/exhibition-texts';

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
