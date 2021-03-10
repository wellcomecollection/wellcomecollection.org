import React from 'react';
import { User } from '../../interfaces';
import { prettyDate } from '../../utils/prettyDate';

type Props = {
  data: User;
};

const UserListItem = ({ data }: Props): JSX.Element => {
  const userPageUrl = '/user/' + data.userId;

  return (
    <tr>
      <td>
        <a href={userPageUrl}>
          {data.firstName} {data.lastName}
        </a>
      </td>
      <td>{data.email}</td>
      <td>{data.barcode}</td>
      <td>{statusMessage(data)}</td>
      <td>{data.lastLogin && prettyDate(data.lastLogin)}</td>
      <td>
        <a href={userPageUrl}>Edit</a>
      </td>
    </tr>
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
