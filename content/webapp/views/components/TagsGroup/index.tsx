import { FunctionComponent } from 'react';

import { font } from '@weco/common/utils/classnames';
import Space from '@weco/common/views/components/styled/Space';
import Tags, { TagType } from '@weco/content/views/components/Tags';

export type Props = {
  title: string | undefined;
  tags: TagType[];
};

const TagsGroup: FunctionComponent<Props> = ({ tags, title }: Props) => {
  return (
    <div data-component="tags-group">
      {title && (
        <Space
          as="h2"
          className={font('brand', -1)}
          $v={{ size: 'm', properties: ['margin-bottom'] }}
        >
          {title}
        </Space>
      )}
      <Tags tags={tags} isFirstPartBold={false} />
    </div>
  );
};
export default TagsGroup;
