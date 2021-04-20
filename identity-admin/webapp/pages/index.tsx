import Layout from '../components/Layout';
import { useUser, withPageAuthRequired } from '@auth0/nextjs-auth0';
import React from 'react';
import UserList from '../components/search/UserList';
import { useUserSearch } from '../hooks/useSearch';
import Pagination from '../components/search/Pagination';
import { useRouter } from 'next/router';
import { StatusBox } from '../components/StatusBox';

const IndexPage: React.FC = () => {
  const router = useRouter();
  const { user } = useUser();
  const { data, isLoading, error } = useUserSearch();
  const { deletedUser } = router.query;

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
          {deletedUser && (
            <StatusBox type="success">Deleted user: {deletedUser}</StatusBox>
          )}
          <UserList items={data?.results} totalResults={data?.totalResults} />
          <Pagination
            currentPage={data?.page + 1 || 1}
            pageCount={data?.pageCount || 1}
          />
        </div>
      )}
    </Layout>
  );
};

export default IndexPage;
export const getServerSideProps = withPageAuthRequired();
