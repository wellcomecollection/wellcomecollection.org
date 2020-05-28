// @flow
import { useState, useEffect } from 'react';
import { workLink } from '../../../services/catalogue/routes';
import { classNames } from '../../../utils/classnames';
import NextLink from 'next/link';
import fetch from 'isomorphic-unfetch';
import styled from 'styled-components';
import DropdownButton from '../DropdownButton/DropdownButton';
import Icon from '../Icon/Icon';

const ArchiveBreadcrumbNav = styled.nav`
  * {
    font-family: 'helvetica neue' !important;
    font-weight: normal !important;
    font-size: 14px !important;
  }

  ul {
    list-style: none;
    margin: 0 0 10px;
    padding: 0;
    display: inline-flex;
    align-items: center;
  }

  li {
    .crumb-inner {
      text-decoration: none;
      display: flex;
      align-items: baseline;
      padding: 3px 8px;
      border-radius: 3px;
    }

    a:hover {
      background: #333;
      color: white;
    }

    .icon {
      margin-right: 5px;
      position: relative;
      top: 2px;
    }

    position: relative;
    margin-right: 20px;

    &:after {
      position: absolute;
      right: -15px;
      top: 50%;
      transform: translateY(-50%);
      font-family: monospace;
      color: #ccc;
      content: '>';
    }

    &:last-child {
      &:after {
        display: none;
      }
    }

    ul {
      display: block;

      li {
        margin-bottom: 1px;

        &:after {
          display: none;
        }

        &:last-child {
          &:after {
            display: none;
          }
        }
      }
    }
  }
`;

type Props = {|
  work: { id: string },
|};

const ConditionalWrapper = ({ condition, wrapper, children }) =>
  condition ? wrapper(children) : children;

const ArchiveBreadcrumb = ({ work }: Props) => {
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
  function makeCrumbs(tree) {
    const allCrumbs = tree.reverse();
    const firstCrumb = allCrumbs[0];
    const lastCrumb = allCrumbs.length > 1 && allCrumbs[allCrumbs.length - 1];
    const middleCrumbs = allCrumbs.length > 2 ? allCrumbs.slice(1, -1) : [];

    return {
      firstCrumb,
      middleCrumbs,
      lastCrumb,
    };
  }

  useEffect(() => {
    const url = `https://api.wellcomecollection.org/catalogue/v2/works/${work.id}?include=collection`;

    fetch(url)
      .then(resp => resp.json())
      .then(resp => {
        if (!resp.collectionPath) return;

        const tree = findTree(resp.collectionPath.path, resp.collection);
        setBreadcrumb(makeCrumbs(tree));
      });
  }, [work]);

  const [breadcrumb, setBreadcrumb] = useState({
    firstCrumb: null,
    middleCrumbs: [],
    lastCrumb: null,
  });

  return (
    <ArchiveBreadcrumbNav>
      <ul>
        {breadcrumb.firstCrumb && (
          <li>
            <ConditionalWrapper
              condition={breadcrumb.firstCrumb.work.id !== work.id}
              wrapper={children => (
                <NextLink {...workLink({ id: breadcrumb.firstCrumb.work.id })}>
                  <a className="crumb-inner">{children}</a>
                </NextLink>
              )}
            >
              <span
                className={classNames({
                  'crumb-inner': breadcrumb.firstCrumb.work.id === work.id,
                })}
              >
                <Icon
                  extraClasses={`icon--match-text icon--currentColor`}
                  name={`archive`}
                />
                {breadcrumb.firstCrumb.work.title}
              </span>
            </ConditionalWrapper>
          </li>
        )}
        {breadcrumb.middleCrumbs.length > 1 && (
          <li>
            <DropdownButton label="…">
              <ul>
                {breadcrumb.middleCrumbs.map(crumb => {
                  return (
                    <li key={crumb.work.id}>
                      <NextLink {...workLink({ id: crumb.work.id })}>
                        <a className="crumb-inner">
                          <Icon
                            extraClasses={`icon--match-text icon--currentColor`}
                            name={
                              crumb.path.level === 'Item'
                                ? 'document'
                                : 'folder'
                            }
                          />
                          {crumb.work.title} {crumb.path.label}
                        </a>
                      </NextLink>
                    </li>
                  );
                })}
              </ul>
            </DropdownButton>
          </li>
        )}
        {breadcrumb.middleCrumbs.length === 1 && (
          <>
            {breadcrumb.middleCrumbs.map(crumb => {
              return (
                <li key={crumb.work.id}>
                  <NextLink {...workLink({ id: crumb.work.id })}>
                    <a className="crumb-inner">
                      <Icon
                        extraClasses={`icon--match-text icon--currentColor`}
                        name={
                          crumb.path.level === 'Item' ? 'document' : 'folder'
                        }
                      />
                      {crumb.work.title} {crumb.path.label}
                    </a>
                  </NextLink>
                </li>
              );
            })}
          </>
        )}
        {breadcrumb.lastCrumb && (
          <li>
            <span className="crumb-inner">
              <Icon
                extraClasses={`icon--match-text icon--currentColor`}
                name={
                  breadcrumb.lastCrumb.path.level === 'Item'
                    ? 'document'
                    : 'folder'
                }
              />
              {breadcrumb.lastCrumb.work.title}{' '}
              {breadcrumb.lastCrumb.path.label}
            </span>
          </li>
        )}
      </ul>
    </ArchiveBreadcrumbNav>
  );
};

export default ArchiveBreadcrumb;
