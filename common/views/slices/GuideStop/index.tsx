import { Content } from '@prismicio/client';
import { SliceComponentProps } from '@prismicio/react';
import { FunctionComponent, useEffect, useState } from 'react';

import linkResolver from '@weco/common/services/prismic/link-resolver';
import GuideStopCard from '@weco/content/components/GuideStopCard';
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
  const [isSliceSimulator, setIsSliceSimulator] = useState(false);

  const { type, exhibitionGuide } = context as {
    type: 'bsl' | 'audio-without-descriptions';
    exhibitionGuide: ExhibitionHighlightTour;
  };

  useEffect(() => {
    setIsSliceSimulator(document.location.pathname === '/slice-simulator');
  }, []);

  const link =
    number && exhibitionGuide
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
      isSliceSimulator={isSliceSimulator}
    />
  );
};

export default GuideStopSlice;
