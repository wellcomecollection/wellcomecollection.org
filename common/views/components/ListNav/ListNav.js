// @flow
import { useState } from 'react';
import { TransitionGroup, CSSTransition } from 'react-transition-group';
import styled from 'styled-components';

const ListNavBreadcrumb = styled.nav`
  ul {
    list-style: none;
    margin: 0;
    padding: 0;
    display: inline-flex;
  }

  li {
    cursor: pointer;
    margin-right: 10px;

    &:after {
      content: '>';
      margin-left: 10px;
    }

    &:last-child:after {
      display: none;
    }
  }
`;

const List = styled.ul`
  list-style: none;
  transition: opacity 350ms ease, transform 350ms ease;
  width: 100%;

  li {
    padding: 20px;
    background: #eee;
    border-top: 1px solid #fff;
    transition: background 350ms ease;
    cursor: pointer;

    &:first-child {
      border-top: 0;
    }

    &:hover {
      background: #ddd;
    }
  }

  &.slide-enter,
  &.slide-exit-active,
  &.slide-exit-done {
    position: absolute;
    opacity: 0;
    transform: translateX(4%);
  }

  &.slide-enter-active,
  &.slide-enter-done {
    opacity: 1;
    transform: translateX(0%);
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
      childIds: ['m', 'n', 'o'],
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
    m: {
      childIds: [],
      parentId: 'i',
    },
    n: {
      childIds: [],
      parentId: 'i',
    },
    o: {
      childIds: [],
      parentId: 'i',
    },
  };
  const [currentItemId, setCurrentItemId] = useState('a');

  function getAncestors(ids) {
    const [firstId] = ids;
    if (!items[firstId].parentId) return ids;

    return getAncestors([items[firstId].parentId, ...ids]);
  }

  return (
    <div>
      <ListNavBreadcrumb>
        you are in:{' '}
        <ul>
          {getAncestors([currentItemId]).map((ancestor, index, arr) => (
            <li key={ancestor} onClick={() => setCurrentItemId(ancestor)}>
              {ancestor}
            </li>
          ))}
        </ul>
      </ListNavBreadcrumb>
      <TransitionGroup className="relative">
        <CSSTransition key={currentItemId} classNames="slide" timeout={350}>
          <List>
            {items[currentItemId].childIds.map(id => (
              <li key={id} onClick={() => setCurrentItemId(id)}>
                {id}{' '}
                {items[id].childIds.length > 0 &&
                  `(${items[id].childIds.length})`}
              </li>
            ))}
            {!items[currentItemId].childIds.length && <li>No children</li>}
          </List>
        </CSSTransition>
      </TransitionGroup>
    </div>
  );
};

export default ListNav;
