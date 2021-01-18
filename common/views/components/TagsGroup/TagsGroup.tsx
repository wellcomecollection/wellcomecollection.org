import { FunctionComponent } from 'react';
import { font } from '../../../utils/classnames';
import Space from '../styled/Space';
import Tags, { TagType } from '../Tags/Tags';

type Props = {
  title: string | undefined;
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
