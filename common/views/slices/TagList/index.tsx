import { SliceComponentProps } from '@prismicio/react';
import { FunctionComponent } from 'react';

import { TagListSlice as RawTagListSlice } from '@weco/common/prismicio-types';
import SpacingComponent from '@weco/common/views/components/styled/SpacingComponent';
import { LayoutWidth, SliceZoneContext } from '@weco/content/components/Body';
import TagsGroup from '@weco/content/components/TagsGroup';
import { transformTagListSlice } from '@weco/content/services/prismic/transformers/body';

export type TagListProps = SliceComponentProps<
  RawTagListSlice,
  SliceZoneContext
>;

const TagList: FunctionComponent<TagListProps> = ({ slice, context }) => {
  const transformedSlice = transformTagListSlice(slice);
  return (
    <SpacingComponent $sliceType={transformedSlice.type}>
      <LayoutWidth width={context.minWidth}>
        <TagsGroup {...transformedSlice.value} />
      </LayoutWidth>
    </SpacingComponent>
  );
};

export default TagList;
