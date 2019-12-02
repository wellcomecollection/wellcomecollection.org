// @flow
import Tags, { type TagType } from '@weco/common/views/components/Tags/Tags';
import WorkDetailsProperty from '../WorkDetailsProperty/WorkDetailsProperty';

type Props = {| title: ?string, tags: TagType[] |};

const WorkDetailsTags = ({ title, tags }: Props) => {
  return (
    <WorkDetailsProperty title={title}>
      <Tags tags={tags} />
    </WorkDetailsProperty>
  );
};

export default WorkDetailsTags;
