import { useState } from 'react';

import { ReturnedResults } from '@weco/common/utils/search';
import Space from '@weco/common/views/components/styled/Space';
import { WorkBasic } from '@weco/content/services/wellcome/catalogue/types';
import Tabs from '@weco/content/views/components/Tabs';
import WorksSearchResults from '@weco/content/views/components/WorksSearchResults';

const SubThemeWorks = ({
  works,
}: {
  // This type is not great but this whole section will
  // probably be removed when we have a better idea of
  // what we want to show on these pages.
  works: ReturnedResults<WorkBasic> & { workTypes: unknown[] };
}) => {
  const [selectedTab, setSelectedTab] = useState('all');

  // TODO add tab behaviour
  // I think this will require new ways to fetch works client side?
  // Or do we make it link to a search results page with the relevant filters applied? That might be easier.
  return (
    <>
      {works.workTypes.length > 0 && (
        <Tabs
          tabBehaviour="switch"
          label="Works by type"
          items={[
            {
              id: 'all',
              text: `All (${works.totalResults})`,
            },
            ...works.workTypes.map(
              // eslint-disable-next-line @typescript-eslint/no-explicit-any
              (workType: any) => ({
                id: workType.label,
                text: `${workType.label} (${workType.count})`,
              })
            ),
          ]}
          selectedTab={selectedTab}
          setSelectedTab={setSelectedTab}
        />
      )}

      <Space $v={{ size: 'md', properties: ['margin-top'] }}>
        <WorksSearchResults works={works.pageResults} />
      </Space>

      {/* TODO add View more button, but where does it point to when it's a high-level concept? */}
    </>
  );
};

export default SubThemeWorks;
