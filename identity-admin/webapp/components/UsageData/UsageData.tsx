import React from 'react';
import { useUserInfo } from '../../context/UserInfoContext';
import { prettyDate } from '../../utils/prettyDate';
import { Container, Name, Value } from './UsageData.style';

type FieldProps = {
  label: string;
  value?: string | number;
};

const Field: React.FC<FieldProps> = ({ label, value }) => (
  <>
    <Name>{label}</Name>
    <Value>{value}</Value>
  </>
);

export function UsageData(): JSX.Element {
  const { user, isLoading } = useUserInfo();

  if (isLoading) {
    return <p>Loading...</p>;
  }

  return (
    <Container>
      <Field label="Creation date" value={prettyDate(user?.creationDate)} />
      <Field label="Last update" value={prettyDate(user?.updatedDate)} />
      <Field label="Last login" value={prettyDate(user?.lastLoginDate)} />
      <Field label="Last login IP" value={user?.lastLoginIp} />
      <Field label="Total logins" value={user?.totalLogins} />
    </Container>
  );
}
