import { FunctionComponent } from 'react';
import { font } from '@weco/common/utils/classnames';
import Space from '@weco/common/views/components/styled/Space';
import Tags, { TagType } from '@weco/common/views/components/Tags/Tags';
  tags: TagType[];
};

const TagsGroup: FunctionComponent<Props> = ({ tags, title }: Props) => {
  return (
    <>
      {title && (
        <Space
          as="h2"
          v={{ size: 'm', properties: ['margin-bottom'] }}
          className={font('wb', 5)}
        >
          {title}
        </Space>
      )}
      <Tags tags={tags} isFirstPartBold={false} />
    </>
  );
};
export default TagsGroup;
