import React from 'react';
import Link from 'next/link';
import { Info } from './Info';
import Layout from '../../components/Layout';
import { Tab, Tabs, TabList, TabPanel } from '../../components/Tabs';
import { Profile } from './Profile';
import { UsageData } from './UsageData';
import { AccountActions } from './AccountActions';
import { useUserInfo } from './UserInfoContext';

function User(): JSX.Element {
  const { error } = useUserInfo();
  return (
    <Layout title="Account administration">
      <h1>
        <Link href="/">Account administration</Link>
      </h1>
      {error ? (
        <h2>Error fetching user: {error.message}</h2>
      ) : (
        <>
          <Info />
          <Tabs
            selectedTabClassName="is-selected"
            selectedTabPanelClassName="is-selected"
          >
            <TabList>
              <Tab>Profile</Tab>
              <Tab>Usage data</Tab>
              <Tab>Account actions</Tab>
            </TabList>
            <TabPanel>
              <Profile />
            </TabPanel>
            <TabPanel>
              <UsageData />
            </TabPanel>
            <TabPanel>
              <AccountActions />
            </TabPanel>
          </Tabs>
        </>
      )}
    </Layout>
  );
}

export default User;
