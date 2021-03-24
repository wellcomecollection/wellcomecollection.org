import React from 'react';
import { useUserInfo } from '../../context/UserInfoContext';
import { humanDate } from '../../utils/humanDate';
import { prettyDate } from '../../utils/prettyDate';
import { UsageDetail, UsageDetailsList, Label, Value } from './UsageData.style';

function TimeBasedDetail(props: { label: string; date?: string }) {
  if (!props.date) return null;
  return (
    <UsageDetail>
      <Label>{props.label}</Label>
      <Value>
        {prettyDate(props.date)} [UTC] ({humanDate(props.date)})
      </Value>
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
