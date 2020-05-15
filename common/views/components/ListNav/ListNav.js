// @flow
import { useState } from 'react';
import styled from 'styled-components';

const List = styled.ul`
  list-style: none;

  li {
    padding: 20px;
    background: #eee;
    border-top: 1px solid #fff;

    &:first-child {
      border-top: 0;
    }
  }
`;

const ListNav = () => {
  const items = {
    a: {
      childIds: ['b', 'c', 'd', 'e'],
      parentId: null,
    },
    b: {
      childIds: ['f', 'g'],
      parentId: 'a',
    },
    c: {
      childIds: ['h', 'i', 'j'],
      parentId: 'a',
    },
    d: {
      childIds: [],
      parentId: 'a',
    },
    e: {
      childIds: ['k', 'l'],
      parentId: 'a',
    },
    f: {
      childIds: [],
      parentId: 'b',
    },
    g: {
      childIds: [],
      parentId: 'b',
    },
    h: {
      childIds: [],
      parentId: 'c',
    },
    i: {
      childIds: [],
      parentId: 'c',
    },
    j: {
      childIds: [],
      parentId: 'c',
    },
    k: {
      childIds: [],
      parentId: 'e',
    },
    l: {
      childIds: [],
      parentId: 'e',
    },
  };
  const [currentItemId, setCurrentItemId] = useState('a');

  return (
    <div>
      <h2>Section {currentItemId}</h2>
      {items[currentItemId].parentId && (
        <span onClick={() => setCurrentItemId(items[currentItemId].parentId)}>
          back up to {items[currentItemId].parentId}
        </span>
      )}
      <List>
        {items[currentItemId].childIds.map(id => (
          <li key={id} onClick={() => setCurrentItemId(id)}>
            {id}{' '}
            {items[id].childIds.length > 0 && `(${items[id].childIds.length})`}
          </li>
        ))}
      </List>
    </div>
  );
};

export default ListNav;
