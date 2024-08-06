import { Content } from '@prismicio/client';
import { SliceComponentProps } from '@prismicio/react';
import { FunctionComponent } from 'react';
import { transformGuideStopSlice } from '@weco/content/services/prismic/transformers/exhibition-highlight-tours';
import GuideStopCard from '@weco/content/components/GuideStopCard';

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

  const { type, id } = context as {
    type: 'bsl' | 'audio-without-descriptions';
    id: string;
  };
  const link = number
    ? `/guides/exhibitions/${id}/${type}/stop-${number}`
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
