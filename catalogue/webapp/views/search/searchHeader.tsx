import { FC, Dispatch, SetStateAction } from 'react';
import TabNav from '@weco/common/views/components/TabNav/TabNav';
import Space from '@weco/common/views/components/styled/Space';

type Props = {
  selectedTab: string;
  setSelectedTab: Dispatch<SetStateAction<string>>;
};

// TODO delete this once we figure out the routing strategy, might not be needed
const SearchHeader: FC<Props> = ({ selectedTab, setSelectedTab }: Props) => {
  return (
    <>
      <Space v={{ size: 'l', properties: ['margin-top', 'margin-bottom'] }}>
        <h2 style={{ marginBottom: 0 }}>Search bar</h2>
      </Space>
      <TabNav
        id="search-tabs"
        hasDivider
        variant="yellow"
        selectedTab={selectedTab}
        items={[
          {
            id: 'overview',
            text: 'Overview',
            selected: selectedTab === 'overview',
          },
          {
            id: 'exhibitions',
            text: 'Exhibitions and events (1032)',
            selected: selectedTab === 'exhibitions',
          },
          {
            id: 'stories',
            text: 'Stories (1032)',
            selected: selectedTab === 'stories',
          },
          {
            id: 'images',
            text: 'Images (1032)',
            selected: selectedTab === 'images',
          },
          {
            id: 'collections',
            text: 'Collections (1032)',
            selected: selectedTab === 'collections',
          },
        ]}
        setSelectedTab={setSelectedTab}
      />
    </>
  );
};

export default SearchHeader;
