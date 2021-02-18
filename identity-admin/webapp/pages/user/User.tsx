import React from 'react';
import { Tab, Tabs, TabList, TabPanel } from 'react-tabs';
import Link from 'next/link';
import { useUserInfo } from '../../hooks/useUserInfo';
import { Info } from './Info';
import Layout from '../../components/Layout';
import { Profile } from './Profile';
import { UsageData } from './UsageData';
import { AccountActions } from './AccountActions';

function User(): JSX.Element {
  const { userInfo } = useUserInfo();
  return (
    <Layout title="Account administration">
      <h1>
        <Link href="/">Account administration</Link>
      </h1>
      <Info {...userInfo} />
      <Tabs>
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
    </Layout>
  );
}

export default User;
