import { useRouter } from 'next/router';
import { FunctionComponent } from 'react';

import { prismicPageIds } from '@weco/common/data/hardcoded-ids';
import SelectableTags from '@weco/content/views/components/SelectableTags';

import { ThematicBrowsingCategories } from '.';

type Props = {
  currentCategory: ThematicBrowsingCategories;
};

const ThematicBrowsingNavigation: FunctionComponent<Props> = ({
  currentCategory,
}) => {
  const router = useRouter();

  const tagItems = [
    {
      id: 'people-and-organisations',
      label: 'People and organisations',
    },
    { id: 'types-and-techniques', label: 'Types and techniques' },
    { id: 'subjects', label: 'Subjects' },
    { id: 'places', label: 'Places' },
  ];

  return (
    <SelectableTags
      tags={tagItems}
      onChange={selectedTags => {
        const selectedTag = selectedTags[0];
        if (selectedTag) {
          router.push(`/${prismicPageIds.collections}/${selectedTag}`);
        }
      }}
      selectedTags={[currentCategory]}
    />
  );
};

export default ThematicBrowsingNavigation;
