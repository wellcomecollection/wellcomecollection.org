import { useState } from 'react';

import Tabs from '@weco/content/views/components/Tabs';

const BrowseByTheme = () => {
  const [selectedTab, setSelectedTab] = useState('featured');

  return (
    <>
      <h2>Browse by theme</h2>

      <Tabs
        tabBehaviour="switch"
        label="browse-collections-by-theme"
        isPill
        items={[
          { id: 'featured', text: 'Featured' },
          {
            id: 'people-organisations',
            text: 'People and organisations',
          },
          { id: 'subjects', text: 'Subjects' },
          { id: 'medicine', text: 'Medicine' },
        ]}
        selectedTab={selectedTab}
        setSelectedTab={setSelectedTab}
      />
      <div
        role="tabpanel"
        id={`tabpanel-${selectedTab}`}
        aria-labelledby={`tab-${selectedTab}`}
      >
        {selectedTab === 'featured' && <div>Featured</div>}
        {selectedTab === 'people-organisations' && (
          <div>People and organisations</div>
        )}
        {selectedTab === 'subjects' && <div>Subjects</div>}
        {selectedTab === 'medicine' && <div>Medicine</div>}
      </div>
    </>
  );
};

export default BrowseByTheme;
