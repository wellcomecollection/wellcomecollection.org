import React from 'react';
import dayjs from 'dayjs';
import { useUserInfo } from '../UserInfoContext';

const prettyDate = (date?: string) => {
  return dayjs(date).format('DD/MM/YYYY HH:mm:ss');
};

type DataFieldProps = {
  label: string;
  value: string | number;
};

const DataField: React.FC<DataFieldProps> = ({ label, value }) => (
  <>
    <p>{label}</p>
    <p>{value}</p>
  </>
);

export function UsageData(): JSX.Element {
  const { user } = useUserInfo();
  return (
    <>
      {user && (
        <>
          <DataField
            label="Creation date"
            value={prettyDate(user.creationDate)}
          />
          <DataField label="Last update" value={prettyDate(user.updatedDate)} />
          <DataField
            label="Last login"
            value={prettyDate(user.lastLoginDate)}
          />
          <DataField label="Last login IP" value={user.lastLoginIp} />
          <DataField label="Total logins" value={user.totalLogins} />
        </>
      )}
    </>
  );
}
