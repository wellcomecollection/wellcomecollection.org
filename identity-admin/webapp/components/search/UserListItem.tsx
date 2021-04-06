import React from 'react';
import { User } from '../../interfaces';
import { prettyDate } from '../../utils/dates';
import Link from 'next/link';

type Props = {
  data: User;
};

const UserListItem = ({ data }: Props): JSX.Element => {
  return (
    <Link href={'/user/' + data.userId}>
      <tr className="user-list__item">
        <td className="user-list__first">
          {data.firstName} {data.lastName}
        </td>
        <td>{data.email}</td>
        <td>{data.userId}</td>
        <td>{statusMessage(data)}</td>
        <td>{data.lastLoginDate && prettyDate(data.lastLoginDate)}</td>
      </tr>
    </Link>
  );
};

function statusMessage(user: User): string {
  if (user.deleteRequested) {
    return 'Pending Delete';
  }
  if (user.locked) {
    return 'Blocked';
  }
  return 'Active';
}

export default UserListItem;
