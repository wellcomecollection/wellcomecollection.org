import Tags, { TagType } from '@weco/common/views/components/Tags/Tags';
import WorkDetailsProperty from '../WorkDetailsProperty/WorkDetailsProperty';
import { FunctionComponent } from 'react';

type Props = { title?: string; tags: TagType[] };

const WorkDetailsTags: FunctionComponent<Props> = ({ title, tags }: Props) => {
  return (
    <WorkDetailsProperty title={title}>
      <Tags tags={tags} />
    </WorkDetailsProperty>
  );
};

export default WorkDetailsTags;
