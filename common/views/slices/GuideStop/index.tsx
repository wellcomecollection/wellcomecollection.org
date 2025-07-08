import { Content } from '@prismicio/client';
import { SliceComponentProps } from '@prismicio/react';
import { FunctionComponent } from 'react';

import linkResolver from '@weco/common/services/prismic/link-resolver';
import GuideStopCard from '@weco/content/views/components/GuideStopCard';
import { transformGuideStopSlice } from '@weco/content/services/prismic/transformers/exhibition-highlight-tours';
import { ExhibitionHighlightTour } from '@weco/content/types/exhibition-guides';
export type GuideStopProps = SliceComponentProps<Content.GuideStopSlice>;

const GuideStopSlice: FunctionComponent<GuideStopProps> = ({
  slice,
  context,
  slices,
}) => {
  const totalGuideStops = slices.filter(
    s => s.slice_type === 'guide_stop'
  ).length;
  const transformedSlice = transformGuideStopSlice(slice);
  const { number, title, image, audioDuration, videoDuration } =
    transformedSlice;

  const { type, exhibitionGuide } = context as {
    type: 'bsl' | 'audio-without-descriptions';
    exhibitionGuide: ExhibitionHighlightTour;
  };

  const link = number
    ? `${linkResolver(exhibitionGuide)}/${type}/${number}`
    : undefined;

  const duration = type === 'bsl' ? videoDuration : audioDuration;

  return (
    <GuideStopCard
      link={link}
      totalStops={totalGuideStops}
      duration={duration}
      number={number}
      title={title}
      type={type === 'bsl' ? 'video' : 'audio'}
      image={image}
    />
  );
};

export default GuideStopSlice;
