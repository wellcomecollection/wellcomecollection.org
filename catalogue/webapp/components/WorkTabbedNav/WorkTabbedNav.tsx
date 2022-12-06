import { Work } from '@weco/common/model/catalogue';
import { FunctionComponent } from 'react';
import SubNavigation from '@weco/common/views/components/SubNavigation/SubNavigation';
import { listView, eye } from '@weco/common/icons';
import { toLink as itemLink } from '@weco/common/views/components/ItemLink/ItemLink';

type Props = {
  work: Work;
  selected: 'catalogueDetails' | 'imageViewer';
};
const WorkTabbedNav: FunctionComponent<Props> = ({ work, selected }) => {
  const itemUrl = itemLink({ workId: work.id }, 'work');
  return (
    <SubNavigation
      label="Search Categories"
      items={[
        {
          id: 'catalogueDetails',
          url: {
            href: {
              pathname: '/work',
              query: {
                id: work.id,
              },
            },
            as: {
              pathname: `/works/${work.id}`,
            },
          },
          name: 'Catalogue details',
          icon: listView,
        },
        {
          id: 'imageViewer',
          url: itemUrl,
          name: 'Image viewer',
          icon: eye,
        },
      ]}
      currentSection={selected}
      hasDivider
      variant="yellow"
    />
  );
};

export default WorkTabbedNav;
