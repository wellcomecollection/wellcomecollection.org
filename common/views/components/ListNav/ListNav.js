// @flow
import { useState, useEffect } from 'react';
import { workLink } from '../../../services/catalogue/routes';
import NextLink from 'next/link';
import { classNames } from '../../../utils/classnames';
import fetch from 'isomorphic-unfetch';
import { TransitionGroup, CSSTransition } from 'react-transition-group';
import styled from 'styled-components';
import Modal from '../Modal/Modal';

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

    &:last-child {
      background: ${props => props.theme.colors.yellow};

      &:after {
        display: none;
      }
  }
`;

const List = styled.ul`
  top: 0;
  padding: 10px 0 0;
  margin: 0;
  list-style: none;
  transition: opacity 350ms ease, transform 350ms ease;
  width: 100%;

  a {
    display: block;
    width: 100%;
    text-decoration: none;
  }

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

type Props = {|
  work: { id: string },
|};

const ListNav = ({ work }: Props) => {
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
        const foundItem = acc[0].children.find(i => i.path.path === curr);

        return [
          {
            work: foundItem.work,
            path: foundItem.path,
            children: foundItem.children,
          },
          ...acc,
        ];
      },
      [
        {
          work: collection.work,
          path: collection.path,
          children: collection.children,
        },
      ]
    );
  }
  const [currentNavItemId, setCurrentNavItemId] = useState(work.id);
  const [isReverse, setIsReverse] = useState(false);

  useEffect(() => {
    const url = `https://api.wellcomecollection.org/catalogue/v2/works/${currentNavItemId}?include=collection`;

    fetch(url)
      .then(resp => resp.json())
      .then(resp => {
        const tree = findTree(resp.collectionPath.path, resp.collection);
        const isTopLevel = tree.length === 1;
        setNavItems(
          isTopLevel
            ? [
                {
                  work: tree[0].work,
                  path: tree[0].path,
                  children: tree[0].children,
                },
              ]
            : tree[1].children
        );
        setTree(tree);
      });
  }, [currentNavItemId]);

  const [tree, setTree] = useState([
    {
      work: { id: null },
      path: { label: null },
      children: [],
    },
  ]);
  const [navItems, setNavItems] = useState([]);
  const [isModalActive, setIsModalActive] = useState(false);

  return (
    <>
      <ListNavBreadcrumb onClick={() => setIsModalActive(true)}>
        <span className={'font-lr font-size-6'}>You are in: </span>
        <ul className={'font-lr font-size-6'}>
          <li>{tree[0].path.label}</li>
        </ul>
      </ListNavBreadcrumb>
      <Modal isActive={isModalActive} setIsActive={setIsModalActive}>
        <div
          style={{
            width: '500px',
            height: '70vh',
            maxWidth: '100%',
            position: 'relative',
          }}
        >
          <TransitionGroup className="relative">
            <CSSTransition
              key={currentNavItemId}
              classNames="slide"
              timeout={350}
            >
              <List isReverse={isReverse}>
                {navItems.map(item => (
                  <li
                    className={classNames({
                      relative: true,
                      'is-active': work.id === item.work.id,
                    })}
                    key={item.work.id}
                  >
                    <NextLink
                      {...workLink({ id: item.work.id })}
                      scroll={false}
                    >
                      <a>
                        <ListInner
                          onClick={() => {
                            setIsModalActive(false);
                          }}
                        >
                          <div className={'font-lr font-size-6'}>
                            {item.path.label}
                          </div>
                          <span className={'font-size-6'}>
                            {item.work.title}
                          </span>
                        </ListInner>
                      </a>
                    </NextLink>
                    {item.children && item.children[0] && (
                      <ViewChildrenButton
                        onClick={() => {
                          setIsReverse(false);
                          setTimeout(() => {
                            setCurrentNavItemId(item.children[0].work.id);
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
              </List>
            </CSSTransition>
          </TransitionGroup>
        </div>
      </Modal>
    </>
  );
};

export default ListNav;
