import { Content } from '@prismicio/client';
import { SliceComponentProps } from '@prismicio/react';
import { FunctionComponent } from 'react';

import { transformGuideSectionHeadingSlice } from '@weco/content/services/prismic/transformers/exhibition-texts';
import SectionHeading from '@weco/content/views/components/GuideSectionHeading';
export type GuideSectionHeadingProps =
  SliceComponentProps<Content.GuideSectionHeadingSlice>;

const GuideSectionHeading: FunctionComponent<GuideSectionHeadingProps> = ({
  slice,
  index,
}) => {
  const transformedSlice = transformGuideSectionHeadingSlice(slice);
  return (
    <SectionHeading
      key={index}
      index={index}
      number={transformedSlice.number}
      title={transformedSlice.title}
      subtitle={transformedSlice.subtitle}
      text={transformedSlice.text}
    />
  );
};

export default GuideSectionHeading;
