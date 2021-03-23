import React from 'react';
import Link from 'next/link';
import { Info } from '../Info';
import Layout from '../../components/Layout';
import { PersonalDetails } from '../PersonalDetails';
import { UsageData } from '../UsageData';
import { useUserInfo } from '../../context/UserInfoContext';
import { Title } from './EditProfile.style';

export function EditProfile(): JSX.Element {
  const { isLoading, error } = useUserInfo();

  return (
    <Layout title="Account administration">
      <Title>
        <Link href="/">Account administration</Link>
      </Title>
      {isLoading ? (
        <p>Loading...</p>
      ) : error ? (
        <h2>Error fetching user: {error.message}</h2>
      ) : (
        <>
          <Info />
          <hr />
          <PersonalDetails />
          <hr />
          <UsageData />
        </>
      )}
    </Layout>
  );
}
