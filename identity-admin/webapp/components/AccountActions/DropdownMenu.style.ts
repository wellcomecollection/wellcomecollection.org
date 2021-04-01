import styled from 'styled-components';
import { Button } from '../Button';

export const Container = styled.div`
  margin-left: auto;
  position: relative;
`;

export const MenuButton = styled(Button)`
  padding: 0 1em;
  display: flex;
  align-items: center;
  gap: 0.5em;
`;

export const Menu = styled.div`
  background-color: white;
  position: absolute;
  top: 100%;
  right: 0;
  width: 18em;
  margin-top: 0.333em;
  z-index: 2;
  border: 1px solid rgba(0, 0, 0, 0.04);
  border-radius: 6px;
  box-shadow: 0 16px 24px 2px rgba(0, 0, 0, 0.14);

  & ul {
    list-style: none;
    padding: 0;
    margin: 0;
  }

  & li {
    padding: 0.666em 1em;
  }

  & li:hover {
    background-color: rgba(0, 0, 0, 0.14);
    cursor: pointer;
  }
`;
