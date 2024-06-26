import { InfoBlockSlice as RawInfoBlockSlice } from '@weco/common/prismicio-types';
import { FunctionComponent } from 'react';
import { SliceComponentProps } from '@prismicio/react';
import SpacingComponent from '@weco/common/views/components/styled/SpacingComponent';
import {
  LayoutWidth,
  SliceZoneContext,
} from '@weco/content/components/Body/Body';
import { transformInfoBlockSlice } from '@weco/content/services/prismic/transformers/body';
import InfoBlock from '@weco/content/components/InfoBlock/InfoBlock';

export type InfoBlockProps = SliceComponentProps<
  RawInfoBlockSlice,
  SliceZoneContext
>;

const InfoBlockSlice: FunctionComponent<InfoBlockProps> = ({
  slice,
  context,
}) => {
  const transformedSlice = transformInfoBlockSlice(slice);
  return (
    <SpacingComponent $sliceType={transformedSlice.type}>
      <LayoutWidth width={context.minWidth}>
        <InfoBlock {...transformedSlice.value} />
      </LayoutWidth>
    </SpacingComponent>
  );
};

export default InfoBlockSlice;
