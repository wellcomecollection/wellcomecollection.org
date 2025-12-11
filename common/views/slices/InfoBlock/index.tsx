import { SliceComponentProps } from '@prismicio/react';
import { FunctionComponent } from 'react';

import { InfoBlockSlice as RawInfoBlockSlice } from '@weco/common/prismicio-types';
import { ContaineredLayout } from '@weco/common/views/components/Layout';
import SpacingComponent from '@weco/common/views/components/styled/SpacingComponent';
import { transformInfoBlockSlice } from '@weco/content/services/prismic/transformers/body';
import { SliceZoneContext } from '@weco/content/views/components/Body';
import InfoBlock from '@weco/content/views/components/InfoBlock';

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
      <ContaineredLayout gridSizes={context.gridSizes}>
        <InfoBlock {...transformedSlice.value} />
      </ContaineredLayout>
    </SpacingComponent>
  );
};

export default InfoBlockSlice;
