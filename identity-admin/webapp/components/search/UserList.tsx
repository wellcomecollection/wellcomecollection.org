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
          <td className="user-list__first">Search by:</td>
          <td />
          <td />
          <td>Filter by status:</td>
          <td />
        </tr>
        <tr className="user-list__filter">
          <SearchInput />
          <td />
          <td className="user-list__filter--status">
            <StatusDropdown />
          </td>
          <td>{totalResults} Results</td>
        </tr>
        <tr>
          <td className="user-list__filter-header user-list__first">
            Name <Sorter fieldName={SortField.Name} />
          </td>
          <td className="user-list__filter-header">
            Email <Sorter fieldName={SortField.Email} />
          </td>
          <td>
            Patron record number <Sorter fieldName={SortField.UserId} />
          </td>
          <td className="user-list__filter--status">Status</td>
          <td>
            Last Login <Sorter fieldName={SortField.LastLogin} />
          </td>
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
