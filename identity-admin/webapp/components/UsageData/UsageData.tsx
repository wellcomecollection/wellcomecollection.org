import React from 'react';
import { useUserInfo } from '../../context/UserInfoContext';
import { prettyDate } from '../../utils/prettyDate';
import { UsageDetail, UsageDetailsList, Label, Value } from './UsageData.style';

export function UsageData(): JSX.Element {
  const { user, isLoading } = useUserInfo();

  if (isLoading) {
    return <p>Loading...</p>;
  }

  return (
    <>
      <h3>Account data</h3>
      <UsageDetailsList>
        <UsageDetail>
          <Label>Last login</Label>
          <Value>{prettyDate(user?.lastLoginDate)}</Value>
        </UsageDetail>
        <UsageDetail>
          <Label>Creation date</Label>
          <Value>{prettyDate(user?.creationDate)}</Value>
        </UsageDetail>
        <UsageDetail>
          <Label>Last login IP</Label>
          <Value>{user?.lastLoginIp}</Value>
        </UsageDetail>
        <UsageDetail>
          <Label>Last update</Label>
          <Value>{prettyDate(user?.updatedDate)}</Value>
        </UsageDetail>
        <UsageDetail>
          <Label>Total logins</Label>
          <Value>{user?.totalLogins}</Value>
        </UsageDetail>
      </UsageDetailsList>
    </>
  );
}
