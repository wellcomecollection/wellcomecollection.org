import { FunctionComponent } from 'react';

import ConditionalWrapper from '@weco/common/views/components/ConditionalWrapper';
import Space from '@weco/common/views/components/styled/Space';
import Tags, { Props as TagsProps } from '@weco/content/views/components/Tags';

import WorkDetailsProperty from './WorkDetails.Property';

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
            $v={{
              size: 'xs',
              properties: ['margin-top'],
              overrides: { small: '100', medium: '100', large: '100' },
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
