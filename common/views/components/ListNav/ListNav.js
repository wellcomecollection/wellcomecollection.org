// @flow
import { useState, useEffect } from 'react';
import { classNames } from '../../../utils/classnames';
import fetch from 'isomorphic-unfetch';
import { TransitionGroup, CSSTransition } from 'react-transition-group';
import styled from 'styled-components';

const ListNavBreadcrumb = styled.nav`
  ul {
    list-style: none;
    margin: 0 0 10px;
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

    &:hover {
      background: ${props => props.theme.colors.yellow}
    }

    &:last-child {
      background: ${props => props.theme.colors.yellow}
      &:after {
        display: none;
      }
  }
`;

const List = styled.ul`
  padding: 0;
  margin: 0;
  list-style: none;
  transition: opacity 350ms ease, transform 350ms ease;
  width: 100%;

  li {
    position: relative;
    background: #eee;
    border-top: 1px solid #fff;
    transition: background 350ms ease;
    cursor: pointer;
    display: flex;
    justify-content: space-between;

    &.is-active {
      &:before {
        content: '';
        position: absolute;
        top: 0;
        bottom: 0;
        left: 0;
        width: 5px;
        background: ${props => props.theme.colors.yellow};
      }
    }

    &:first-child {
      border-top: 0;
    }

    &:hover {
      background: #ddd;
    }
  }

  &.slide-enter {
    position: absolute;
    opacity: 0;
    transform: ${props =>
      props.isReverse ? 'translateX(-100%)' : 'translateX(100%)'};
  }

  &.slide-exit-active,
  &.slide-exit-done {
    transform: ${props =>
      props.isReverse ? 'translateX(100%)' : 'translateX(-100%)'};
  };
  }

  &.slide-enter-active,
  &.slide-enter-done {
    opacity: 1;
    transform: translateX(0%);
  }
`;

const ListInner = styled.div`
  padding: 20px;
  width: 100%;
`;

const ViewChildrenButton = styled.span`
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  right: 20px;
  padding: 3px 5px;
  border: 1px solid grey;
  border-radius: 3px;
  background: white;

  &:hover {
    background: ${props => props.theme.colors.yellow};
  }
`;

const ListNav = () => {
  function findTree(path, collection) {
    const pathParts = path.split('/'); // ['PPCRI', 'A', '1', '1']
    const pathsToChildren = pathParts
      .reduce((acc, curr, index) => {
        if (index === 0) return [pathParts[0]];

        return [...acc, `${acc[index - 1]}/${curr}`];
      }, [])
      .slice(1); // ['PPCRI/A', 'PPCRI/A/1', 'PPCRI/A/1/1']

    return pathsToChildren.reduce(
      (acc, curr) => {
        const foundItem = acc.children.find(i => i.path.path === curr);

        return {
          ancestors: [
            ...acc.ancestors,
            {
              id: foundItem.work.id,
              path: foundItem.path.path,
            },
          ],
          children: foundItem.children,
        };
      },
      {
        children: collection.children,
        ancestors: [{ id: collection.work.id, path: collection.path.path }],
      }
    );
  }
  const [currentItemId, setCurrentItemId] = useState('hz43r7re');
  const [breadcrumb, setBreadcrumb] = useState([]);
  const [isReverse, setIsReverse] = useState(false);

  useEffect(() => {
    const url = `https://api.wellcomecollection.org/catalogue/v2/works/${currentItemId}?include=collection`;

    fetch(url)
      .then(resp => resp.json())
      .then(resp => {
        const tree = findTree(resp.collectionPath.path, resp.collection);
        setItems(tree.children);
        setBreadcrumb(tree.ancestors);
      });
  }, [currentItemId]);

  const [items, setItems] = useState([]);
  const [activeItem, setActiveItem] = useState({ work: { id: null } });

  return (
    <div>
      <ListNavBreadcrumb>
        <span className={'font-lr font-size-6'}>you are in: </span>
        <ul className={'font-lr font-size-6'}>
          {breadcrumb.map(crumb => (
            <li
              key={crumb.id}
              onClick={() => {
                setIsReverse(true);
                setTimeout(() => {
                  setCurrentItemId(crumb.id);
                }, 0);
              }}
            >
              {crumb.path}
            </li>
          ))}
        </ul>
      </ListNavBreadcrumb>
      <TransitionGroup className="relative">
        <CSSTransition key={currentItemId} classNames="slide" timeout={350}>
          <List isReverse={isReverse}>
            {items.map(item => (
              <li
                className={classNames({
                  relative: true,
                  'is-active': activeItem.work.id === item.work.id,
                })}
                key={item.work.id}
              >
                <ListInner onClick={() => setActiveItem(item)}>
                  <div className={'font-lr font-size-6'}>{item.path.label}</div>
                  <span className={'font-size-6'}>{item.work.title}</span>
                </ListInner>
                {item.path.level !== 'Item' && (
                  <ViewChildrenButton
                    onClick={() => {
                      setIsReverse(false);
                      setTimeout(() => {
                        setCurrentItemId(item.work.id);
                      }, 0);
                    }}
                    className={classNames({
                      'font-lr font-size-6': true,
                    })}
                  >
                    {item.path.level} &gt;
                  </ViewChildrenButton>
                )}
              </li>
            ))}
            {!items.length && (
              <li>
                <ListInner>
                  <span className={'font-size-6'}>Nothing here</span>
                </ListInner>
              </li>
            )}
          </List>
        </CSSTransition>
      </TransitionGroup>
    </div>
  );
};

export default ListNav;
