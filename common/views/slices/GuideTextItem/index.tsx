import { Content } from '@prismicio/client';
import { FunctionComponent } from 'react';
import { SliceComponentProps } from '@prismicio/react';
import { transformGuideTextItemSlice } from '@weco/content/services/prismic/transformers/exhibition-texts';
import TextItem from '@weco/content/components/GuideTextItem/GuideTextItem';

export type GuideTextItemProps =
  SliceComponentProps<Content.GuideTextItemSlice>;

const GuideTextItem: FunctionComponent<GuideTextItemProps> = ({
  slice,
  index,
}) => {
  const transformedSlice = transformGuideTextItemSlice(slice);

  return (
    <TextItem
      key={index}
      number={transformedSlice.number}
      title={transformedSlice.title}
      tombstone={transformedSlice.tombstone}
      caption={transformedSlice.caption}
      additionalNotes={transformedSlice.additional_notes}
    />
  );
};

export default GuideTextItem;
