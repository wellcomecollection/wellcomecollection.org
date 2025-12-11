import { SliceComponentProps } from '@prismicio/react';
import { FunctionComponent } from 'react';

import { TagListSlice as RawTagListSlice } from '@weco/common/prismicio-types';
import { ContaineredLayout } from '@weco/common/views/components/Layout';
import SpacingComponent from '@weco/common/views/components/styled/SpacingComponent';
import { transformTagListSlice } from '@weco/content/services/prismic/transformers/body';
import { SliceZoneContext } from '@weco/content/views/components/Body';
import TagsGroup from '@weco/content/views/components/TagsGroup';

export type TagListProps = SliceComponentProps<
  RawTagListSlice,
  SliceZoneContext
>;

const TagList: FunctionComponent<TagListProps> = ({ slice, context }) => {
  const transformedSlice = transformTagListSlice(slice);
  return (
    <SpacingComponent $sliceType={transformedSlice.type}>
      <ContaineredLayout gridSizes={context.gridSizes}>
        <TagsGroup {...transformedSlice.value} />
      </ContaineredLayout>
    </SpacingComponent>
  );
};

export default TagList;
