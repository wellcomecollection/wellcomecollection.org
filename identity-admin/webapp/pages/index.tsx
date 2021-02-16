import Layout from '../components/Layout';
import { useUser, withPageAuthRequired } from '@auth0/nextjs-auth0';
import React from 'react';

const IndexPage: React.FC = () => {
  const { user } = useUser();

  if (user) {
    return (
      <Layout title="Account administration">
        <h1>Hi {user.name}</h1>
        <a href="/api/auth/logout">Logout</a>
      </Layout>
    );
  }

  return (
    <Layout title="Account administration">
      <a href="/api/auth/login">Login</a>
    </Layout>
  );
};

export default IndexPage;
export const getServerSideProps = withPageAuthRequired();
