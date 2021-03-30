import React from 'react';
import { useUserInfo } from '../../context/UserInfoContext';
import { humanDate, prettyDate } from '../../utils/dates';
import { UsageDetail, UsageDetailsList, Label, Value } from './UsageData.style';

function TimeBasedDetail(props: { label: string; date?: string }) {
  if (!props.date) return null;
  return (
    <UsageDetail>
      <Label>{props.label}</Label>
      <Value>{humanDate(props.date)}</Value>
      <Value minor>{prettyDate(props.date)} UTC</Value>
    </UsageDetail>
  );
}

export function UsageData(): JSX.Element {
  const { user, isLoading } = useUserInfo();

  if (isLoading) {
    return <p>Loading...</p>;
  }

  return (
    <>
      <h3>Account data</h3>
      <UsageDetailsList>
        <TimeBasedDetail label="Last login" date={user?.lastLoginDate} />
        <TimeBasedDetail label="Creation date" date={user?.creationDate} />
        <UsageDetail>
          <Label>Last login IP</Label>
          <Value>{user?.lastLoginIp}</Value>
        </UsageDetail>
        <TimeBasedDetail label="Last update" date={user?.updatedDate} />
        <UsageDetail>
          <Label>Total logins</Label>
          <Value>{user?.totalLogins}</Value>
        </UsageDetail>
      </UsageDetailsList>
    </>
  );
}
