import Layout from '../components/Layout';
import { useUser, withPageAuthRequired } from '@auth0/nextjs-auth0';
import React from 'react';
import UserList from '../components/search/UserList';
import { useUserSearch } from '../hooks/useSearch';
import Pagination from '../components/search/Pagination';

const IndexPage: React.FC = () => {
  const { user } = useUser();
  const { data, isLoading, error } = useUserSearch();

  return (
    <Layout title="Account administration">
      {user && (
        <div className="header">
          <h1 className="header__title">Account Administration</h1>
          <div className="header__logout">
            {user.name} | <a href="/api/auth/logout">Logout</a>
          </div>
        </div>
      )}
      {isLoading && <div>Loading...</div>}
      {error && <div>{error}</div>}
      {data && (
        <div>
          <UserList items={data?.results} />
          <Pagination
            currentPage={data?.page || 1}
            pageCount={data?.pageCount || 1}
          />
        </div>
      )}
    </Layout>
  );
};

export default IndexPage;
export const getServerSideProps = withPageAuthRequired();
