import { useRouter } from 'next/router';
import { FunctionComponent } from 'react';

import { prismicPageIds } from '@weco/common/data/hardcoded-ids';
import SelectableTags from '@weco/content/views/components/SelectableTags';

const categories = [
  'people-and-organisations',
  'types-and-techniques',
  'subjects',
  'places',
] as const;
export type ThematicBrowsingCategories = (typeof categories)[number];

export function isValidThematicBrowsingCategory(
  type?: string
): type is ThematicBrowsingCategories {
  return categories.includes(type as ThematicBrowsingCategories);
}
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
