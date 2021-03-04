import * as React from 'react';
import UserListItem from './UserListItem';
import { SortField, User } from '../../interfaces';
import StatusDropdown from './StatusDropdown';
import SearchInput from './SearchInput';
import Sorter from './Sorter';
import { useState } from 'react';
import {useRouter} from "next/router";

type Props = {
  items: User[] | undefined;
};

const UserList = ({ items }: Props): JSX.Element => {
  const router = useRouter();
  const { status, name, email } = router.query;
  const [showFilters, setShowFilters] = useState<boolean>(
    !!name || !!email || !!status
  );

  const onToggleFilterBar = () => {
    setShowFilters(!showFilters);
  };

  return (
    <table className="user-list">
      <thead className="user-list__head">
        <tr>
          <td className="user-list__filter-header">
            Name <Sorter fieldName={SortField.Name} />
          </td>
          <td className="user-list__filter-header">
            Email <Sorter fieldName={SortField.Email} />
          </td>
          <td>
            Patron record number <Sorter fieldName={SortField.UserId} />
          </td>
          <td className="user-list__filter-header">
            Status <Sorter fieldName={SortField.Locked} />
          </td>
          <td>
            Last Login <Sorter fieldName={SortField.LastLogin} />
          </td>
          <td>
            <button onClick={onToggleFilterBar}>Filter</button>
          </td>
        </tr>
        {showFilters && (
          <tr className="user-list__filter">
            <SearchInput />
            <td />
            <td className="user-list__filter-header">
              <StatusDropdown />
            </td>
            <td />
            <td />
          </tr>
        )}
      </thead>
      <tbody className="user-list__body">
        {items &&
          items.map(item => <UserListItem key={item.userId} data={item} />)}
      </tbody>
    </table>
  );
};

export default UserList;
