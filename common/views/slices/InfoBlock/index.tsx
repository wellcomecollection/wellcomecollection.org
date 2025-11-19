import { SliceComponentProps } from '@prismicio/react';
import { FunctionComponent } from 'react';

import { InfoBlockSlice as RawInfoBlockSlice } from '@weco/common/prismicio-types';
import { dasherize } from '@weco/common/utils/grammar';
import SpacingComponent from '@weco/common/views/components/styled/SpacingComponent';
import { transformInfoBlockSlice } from '@weco/content/services/prismic/transformers/body';
import {
  defaultContext,
  LayoutWidth,
  SliceZoneContext,
} from '@weco/content/views/components/Body';
import InfoBlock from '@weco/content/views/components/InfoBlock';

export type InfoBlockProps = SliceComponentProps<
  RawInfoBlockSlice,
  SliceZoneContext
>;

const InfoBlockSlice: FunctionComponent<InfoBlockProps> = ({
  slice,
  context,
}) => {
  const options = { ...defaultContext, ...context };
  const transformedSlice = transformInfoBlockSlice(slice);
  const sectionId = dasherize(transformedSlice.value.title);
  const content = <InfoBlock {...transformedSlice.value} />;

  return (
    <SpacingComponent
      $sliceType={transformedSlice.type}
      $sliceId={options.stickyNavA11y ? sectionId : undefined}
      $useSectionElement={options.stickyNavA11y}
    >
      {options.isInGridCell && options.stickyNavA11y ? (
        content
      ) : (
        <LayoutWidth width={context.minWidth}>{content}</LayoutWidth>
      )}
    </SpacingComponent>
  );
};

export default InfoBlockSlice;
