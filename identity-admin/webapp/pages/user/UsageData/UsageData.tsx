import React from 'react';
import dayjs from 'dayjs';
import { useUserInfo } from '../UserInfoContext';
import { Container, Name, Value } from './UsageData.style';

const prettyDate = (date?: string) => {
  return dayjs(date).format('DD/MM/YYYY HH:mm:ss');
};

type FieldProps = {
  label: string;
  value: string | number;
};

const Field: React.FC<FieldProps> = ({ label, value }) => (
  <>
    <Name>{label}</Name>
    <Value>{value}</Value>
  </>
);

export function UsageData(): JSX.Element {
  const { user } = useUserInfo();
  return (
    <Container>
      {user && (
        <>
          <Field label="Creation date" value={prettyDate(user.creationDate)} />
          <Field label="Last update" value={prettyDate(user.updatedDate)} />
          <Field label="Last login" value={prettyDate(user.lastLoginDate)} />
          <Field label="Last login IP" value={user.lastLoginIp} />
          <Field label="Total logins" value={user.totalLogins} />
        </>
      )}
    </Container>
  );
}
