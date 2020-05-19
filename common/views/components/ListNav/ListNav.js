// @flow
import { useState, useEffect } from 'react';
import fetch from 'isomorphic-unfetch';
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
  function findAncestors() {
    // TODO: write this for a breadcrumb
  }
  function findChildren(path, collectionChildren) {
    const pathParts = path.split('/'); // ['PPCRI', 'A', '1', '1']
    const pathsToChildren = pathParts
      .reduce((acc, curr, index) => {
        if (index === 0) return [pathParts[0]];

        return [...acc, `${acc[index - 1]}/${curr}`];
      }, [])
      .slice(1); // ['PPCRI/A', 'PPCRI/A/1', 'PPCRI/A/1/1']

    return pathsToChildren.reduce(
      (acc, curr) => acc.find(i => i.path.path === curr).children,
      collectionChildren
    );
  }
  const [currentItemId, setCurrentItemId] = useState('hz43r7re');
  useEffect(() => {
    const url = `https://api.wellcomecollection.org/catalogue/v2/works/${currentItemId}?include=collection`;

    fetch(url)
      .then(resp => resp.json())
      .then(resp => {
        setItems(
          findChildren(resp.collectionPath.path, resp.collection.children)
        );
      });
  }, [currentItemId]);

  const [items, setItems] = useState([]);

  return (
    <div>
      <TransitionGroup className="relative">
        <CSSTransition key={currentItemId} classNames="slide" timeout={350}>
          <List>
            {items.map(item => (
              <li
                key={item.work.id}
                onClick={() => setCurrentItemId(item.work.id)}
              >
                <div className={'font-lr font-size-6'}>{item.path.label}</div>
                <span className={'font-size-6'}>{item.work.title}</span>
              </li>
            ))}
            {!items.length && (
              <li>
                <span className={'font-size-6'}>Nothing here</span>
              </li>
            )}
          </List>
        </CSSTransition>
      </TransitionGroup>
    </div>
  );
};

export default ListNav;
