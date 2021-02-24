import React from 'react';
import Link from 'next/link';
import { Info } from './Info';
import Layout from '../../components/Layout';
import { Tab, Tabs, TabList, TabPanel } from '../../components/Tabs';
import { Profile } from './Profile';
import { UsageData } from './UsageData';
import { AccountActions } from './AccountActions';
import { useUserInfo } from './UserInfoContext';
import { Title } from './User.style';

function User(): JSX.Element {
  const { isLoading, error } = useUserInfo();

  if (isLoading) {
    return (
      <Layout title="Account administration">
        <Title>
          <Link href="/">Account administration</Link>
        </Title>
        <p>Loading...</p>
      </Layout>
    );
  }

  return (
    <Layout title="Account administration">
      <Title>
        <Link href="/">Account administration</Link>
      </Title>
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
