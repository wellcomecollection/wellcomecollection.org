import styled, { css } from 'styled-components';

export const TitleContainer = styled.div`
  display: flex;
  align-items: center;
  gap: 1em;
`;

const Info = css`
  background-color: #fff3cd;
  border: 1px solid #ffeeba;
  color: #856404;
`;

const Success = css`
  background-color: #d4edda;
  border: 1px solid #c3e6cb;
  color: #155724;
`;

const Failure = css`
  background-color: #ecdad4;
  border: 1px solid #e6cbc2;
  color: #572414;
`;

type Status = 'success' | 'failure' | 'info';

export const StatusBox = styled.aside.attrs<{
  type: Status;
}>(props => ({ role: props.type === 'info' ? 'complementary' : 'alert' }))<{
  type: Status;
}>`
  ${props => {
    switch (props.type) {
      case 'success':
        return Success;
      case 'failure':
        return Failure;
      default:
        return Info;
    }
  }}
  padding: 1em;
  margin-bottom: 1em;
`;

export const AccountDetailsList = styled.dl`
  display: flex;
  gap: 3em;
`;

export const AccountDetail = styled.div`
  display: flex;
  gap: 1em;
`;

export const AccountDetailsLabel = styled.dt`
  font-weight: bold;
`;

export const AccountDetailsValue = styled.dd`
  margin: 0;
`;
