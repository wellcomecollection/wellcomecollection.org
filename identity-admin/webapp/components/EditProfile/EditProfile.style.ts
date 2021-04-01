import styled from 'styled-components';

export const TitleContainer = styled.div`
  width: 100%;
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

export const MainScreenLink = styled.a`
  width: fit-content;
  text-decoration: none;
  display: flex;
  align-items: center;
  gap: 0.5em;
`;

export const LogoutLink = styled.a.attrs({
  href: '/api/auth/logout',
  children: 'Logout',
})``;
