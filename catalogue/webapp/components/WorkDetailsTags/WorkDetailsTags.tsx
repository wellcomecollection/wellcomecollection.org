import Tags, {
  Props as TagsProps,
} from '@weco/common/views/components/Tags/Tags';
import WorkDetailsProperty from '../WorkDetailsProperty/WorkDetailsProperty';
import { FunctionComponent } from 'react';

type Props = { title?: string } & TagsProps;

const WorkDetailsTags: FunctionComponent<Props> = ({
  title,
  ...tagsProps
}: Props) => {
  return (
    <WorkDetailsProperty title={title}>
      <Tags {...tagsProps} />
    </WorkDetailsProperty>
  );
};

export default WorkDetailsTags;
