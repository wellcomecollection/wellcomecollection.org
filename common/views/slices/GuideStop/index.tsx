import { Content } from '@prismicio/client';
import { SliceComponentProps } from '@prismicio/react';
import { FunctionComponent } from 'react';
import { transformGuideStopSlice } from '@weco/content/services/prismic/transformers/exhibition-highlight-tours';
import GuideMediaStop from '@weco/content/components/GuideMediaStop/GuideMediaStop';

export type GuideStopProps = SliceComponentProps<Content.GuideStopSlice>;

const GuideStop: FunctionComponent<GuideStopProps> = ({ slice, context }) => {
  const transformedSlice = transformGuideStopSlice(slice);
  const { number, title, audio, video } = transformedSlice;
  const { type } = context as {
    type: 'bsl' | 'audio-without-descriptions' | 'audio-with-descriptions';
  };

  return (
    <GuideMediaStop
      number={number}
      title={title}
      audio={audio}
      video={video}
      type={type}
    />
  );
};

export default GuideStop;
