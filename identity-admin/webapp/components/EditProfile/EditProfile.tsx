import React from 'react';
import Link from 'next/link';
import { Info } from '../Info';
import Layout from '../../components/Layout';
import { PersonalDetails } from '../PersonalDetails';
import { UsageData } from '../UsageData';
import { useUserInfo } from '../../context/UserInfoContext';
import {
  LogoutLink,
  MainScreenLink,
  TitleContainer,
} from './EditProfile.style';
import { Arrow } from '../Icons/Arrow';

export function EditProfile(): JSX.Element {
  const { isLoading, error } = useUserInfo();

  return (
    <Layout title="Account administration">
      <TitleContainer>
        <h1>Account administration</h1>
        <LogoutLink />
      </TitleContainer>
      <Link href="/" passHref>
        <MainScreenLink>
          <Arrow
            height="24"
            width="24"
            fill="currentColor"
            style={{ transform: 'rotate(180deg)' }}
          />
          Main screen
        </MainScreenLink>
      </Link>
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
