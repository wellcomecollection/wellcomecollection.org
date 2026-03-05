import { useState } from 'react';

import { formatNumber } from '@weco/common/utils/grammar';
import { ReturnedResults } from '@weco/common/utils/search';
import Space from '@weco/common/views/components/styled/Space';
import { themeValues } from '@weco/common/views/themes/config';
import { WorkBasic } from '@weco/content/services/wellcome/catalogue/types';
import MoreLink from '@weco/content/views/components/MoreLink';
import { toSearchWorksLink } from '@weco/content/views/components/SearchPagesLink/Works';
import Tabs from '@weco/content/views/components/Tabs';
import WorksSearchResults from '@weco/content/views/components/WorksSearchResults';

const SubThemeWorks = ({
  subThemeName,
  works,
  conceptsDisplayLabels,
}: {
  subThemeName: string;
  // This type is not great but this whole section will
  // probably be removed when we have a better idea of
  // what we want to show on these pages.
  works: ReturnedResults<WorkBasic> & { workTypes: unknown[] };
  conceptsDisplayLabels: string[];
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
              text: `All (${formatNumber(works.totalResults)})`,
            },
            ...works.workTypes.map(
              // eslint-disable-next-line @typescript-eslint/no-explicit-any
              (workType: any) => ({
                id: workType.label,
                text: `${workType.label} (${formatNumber(workType.count)})`,
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

      <MoreLink
        ariaLabel={`View all works about ${subThemeName}`}
        name="View all"
        url={toSearchWorksLink({ 'subjects.label': conceptsDisplayLabels })}
        colors={themeValues.buttonColors.greenGreenWhite}
      />
    </>
  );
};

export default SubThemeWorks;
