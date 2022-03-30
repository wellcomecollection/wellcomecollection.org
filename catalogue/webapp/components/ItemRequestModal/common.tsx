import styled from 'styled-components';
import Space from '@weco/common/views/components/styled/Space';
import { FC } from 'react';

export const CTAs = styled(Space).attrs({
  v: { size: 'l', properties: ['margin-top'] },
})``;

const CurrentRequestCount = styled(Space).attrs({
  h: { size: 's', properties: ['padding-left', 'margin-left'] },
})`
  border-left: 5px solid ${props => props.theme.color('yellow')};
`;

export const CurrentRequests: FC<{
  allowedHoldRequests: number;
  currentHoldRequests?: number;
}> = ({ allowedHoldRequests, currentHoldRequests }) =>
  typeof currentHoldRequests !== 'undefined' ? (
    <CurrentRequestCount>
      {`${currentHoldRequests}/${allowedHoldRequests} item${
        currentHoldRequests !== 1 ? 's' : ''
      } requested`}
    </CurrentRequestCount>
  ) : null;

export const Header = styled(Space).attrs({
  v: { size: 'm', properties: ['margin-bottom'] },
})`
  display: flex;
  justify-content: space-between;
  align-items: center;
`;
