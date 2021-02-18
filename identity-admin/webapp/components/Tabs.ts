import {
  Tab as _Tab,
  Tabs as _Tabs,
  TabList as _TabList,
  TabPanel as _TabPanel,
} from 'react-tabs';
import styled from 'styled-components';

export const Tab = styled(_Tab)`
  margin-right: 4px;
  border: 1px solid black;
  padding: 4px;
  user-select: none;
  cursor: arrow;

  &.is-selected {
    color: white;
    background: black;
    border-bottom: 1px solid white;
  }

  &:focus {
    outline: none;
    box-shadow: 0 0 0 2px rgba(0, 0, 255, 0.5);
  }
`;

export const Tabs = styled(_Tabs)`
  /* width: 50%; */
`;

export const TabList = styled(_TabList)`
  list-style-type: none;
  padding: 4px;
  display: flex;
  margin: 0;
`;

export const TabPanel = styled(_TabPanel)`
  display: none;
  min-height: 40vh;
  border: 1px solid black;
  padding: 4px;
  margin-top: -5px;

  &.is-selected {
    display: block;
  }
`;
