import Tags, {
  Props as TagsProps,
} from '@weco/common/views/components/Tags/Tags';
import WorkDetailsProperty from '../WorkDetailsProperty/WorkDetailsProperty';
import { FunctionComponent } from 'react';
import Space from '@weco/common/views/components/styled/Space';
import ConditionalWrapper from '@weco/common/views/components/ConditionalWrapper/ConditionalWrapper';

type Props = { title?: string } & TagsProps;

const WorkDetailsTags: FunctionComponent<Props> = ({
  title,
  ...tagsProps
}: Props) => {
  return (
    <WorkDetailsProperty title={title}>
      <ConditionalWrapper
        condition={Boolean(title)}
        wrapper={children => (
          <Space
            v={{
              size: 's',
              properties: ['margin-top'],
              overrides: { small: 3, medium: 3, large: 3 },
            }}
          >
            {children}
          </Space>
        )}
      >
        <Tags {...tagsProps} />
      </ConditionalWrapper>
    </WorkDetailsProperty>
  );
};

export default WorkDetailsTags;
