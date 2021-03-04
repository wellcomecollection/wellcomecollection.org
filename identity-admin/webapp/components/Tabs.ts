import {
  Tab as _Tab,
  Tabs as _Tabs,
  TabList as _TabList,
  TabPanel as _TabPanel,
} from 'react-tabs';
import styled from 'styled-components';

export const Tab = styled(_Tab)`
  margin-right: 4px;
  border: none;
  padding: 0.333em 1em 0.333em;
  user-select: none;
  cursor: pointer;

  &.is-selected {
    border-bottom: 10px solid #ffc107;
  }
`;

export const Tabs = _Tabs;

export const TabList = styled(_TabList)`
  list-style-type: none;
  display: flex;
  padding: 0;
  margin: 0;
  font-family: 'Wellcome Bold', sans-serif;
  font-size: 1.1rem;
`;

export const TabPanel = styled(_TabPanel)`
  display: none;
  min-height: 40vh;
  padding: 4px;
  margin-top: 5px;

  &.is-selected {
    display: block;
  }
`;
