import { FunctionComponent } from 'react';

import { useToggles } from '@weco/common/server-data/Context';
import ConditionalWrapper from '@weco/common/views/components/ConditionalWrapper';
import Space from '@weco/common/views/components/styled/Space';
import Tags, { Props as TagsProps } from '@weco/content/components/Tags';

import WorkDetailsProperty from './WorkDetails.Property';

type Props = { title?: string } & TagsProps;

const WorkDetailsTags: FunctionComponent<Props> = ({
  title,
  ...tagsProps
}: Props) => {
  const { newTags } = useToggles();

  return (
    <WorkDetailsProperty title={title}>
      <ConditionalWrapper
        condition={Boolean(title)}
        wrapper={children => (
          <Space
            $v={{
              size: 's',
              properties: ['margin-top'],
              overrides: { small: 3, medium: 3, large: 3 },
            }}
          >
            {children}
          </Space>
        )}
      >
        <Tags {...tagsProps} isABTestWorkTag={newTags} />
      </ConditionalWrapper>
    </WorkDetailsProperty>
  );
};

export default WorkDetailsTags;
