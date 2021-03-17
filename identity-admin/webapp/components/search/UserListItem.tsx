import React from 'react';
import { User } from '../../interfaces';
import { prettyDate } from '../../utils/prettyDate';

type Props = {
  data: User;
};

const UserListItem = ({ data }: Props): JSX.Element => {
  const userPageUrl = '/user/' + data.userId;
  const redirectToUser = () => {
    window.location.href = userPageUrl;
  };

  return (
    <tr onClick={redirectToUser}>
      <td className="user-list__first">
        {data.firstName} {data.lastName}
      </td>
      <td>{data.email}</td>
      <td>{data.barcode}</td>
      <td>{statusMessage(data)}</td>
      <td>{data.lastLogin && prettyDate(data.lastLogin)}</td>
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
