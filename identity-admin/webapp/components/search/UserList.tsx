import * as React from 'react';
import UserListItem from './UserListItem';
import { SortField, User } from '../../interfaces';
import StatusDropdown from './StatusDropdown';
import SearchInput from './SearchInput';
import Sorter from './Sorter';

type Props = {
  items: User[] | undefined;
  totalResults: number;
};

const UserList = ({ items, totalResults }: Props): JSX.Element => {
  return (
    <table className="user-list">
      <thead className="user-list__head">
        <tr className="user-list__filter user-list__filter--labels">
          <th className="user-list__first">Search by name:</th>
          <th>Search by email address:</th>
          <th />
          <th>Filter by status:</th>
          <th />
        </tr>
        <tr className="user-list__filter">
          <SearchInput />
          <th />
          <th className="user-list__filter--status">
            <StatusDropdown />
          </th>
          <th>{totalResults} Results</th>
        </tr>
        <tr>
          <th className="user-list__filter-header user-list__first">
            Name <Sorter fieldName={SortField.Name} />
          </th>
          <th className="user-list__filter-header">
            Email <Sorter fieldName={SortField.Email} />
          </th>
          <th>
            Patron record number <Sorter fieldName={SortField.UserId} />
          </th>
          <th className="user-list__filter--status">Status</th>
          <th>
            Last Login <Sorter fieldName={SortField.LastLogin} />
          </th>
        </tr>
      </thead>
      <tbody className="user-list__body">
        {items &&
          items.map(item => <UserListItem key={item.userId} data={item} />)}
      </tbody>
    </table>
  );
};

export default UserList;
