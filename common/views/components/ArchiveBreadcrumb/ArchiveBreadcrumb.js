// @flow
import { useState, useEffect } from 'react';
import { type Work } from '@weco/common/model/work';
import { workLink } from '../../../services/catalogue/routes';
import { getTreeBranches } from '../../../utils/works';
import { classNames } from '../../../utils/classnames';
import NextLink from 'next/link';
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
    align-items: flex-start;
  }

  li {
    .crumb-inner {
      display: flex;
      align-items: baseline;
      padding: 3px 8px;
      max-width: 35em;
    }

    > .icon {
      min-width: 1em;
      position: relative;
      top: 5px;
    }

    position: relative;
    margin-right: 24px;

    &:after {
      content: '>';
      position: absolute;
      top: 3px;
      right: -15px;
      color: #888;
    }

    &:last-child {
      &:after {
        display: none;
      }
    }

    ul {
      display: block;
      min-width: max-content;
      white-space: normal;

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
  work: Work,
|};

const ConditionalWrapper = ({ condition, wrapper, children }) =>
  condition ? wrapper(children) : children;

const ArchiveBreadcrumb = ({ work }: Props) => {
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
    const tree = getTreeBranches(work.collectionPath.path, work.collection);
    setBreadcrumb(makeCrumbs(tree));
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
          <li className={'flex'}>
            <Icon
              extraClasses={`icon--match-text icon--currentColor`}
              name={`archive`}
            />
            <ConditionalWrapper
              condition={
                breadcrumb.firstCrumb.work &&
                breadcrumb.firstCrumb.work.id !== work.id
              }
              wrapper={children => (
                <NextLink {...workLink({ id: breadcrumb.firstCrumb.work.id })}>
                  <a className="crumb-inner">{children}</a>
                </NextLink>
              )}
            >
              <span
                className={classNames({
                  'crumb-inner':
                    breadcrumb.firstCrumb.work &&
                    breadcrumb.firstCrumb.work.id === work.id,
                })}
              >
                {breadcrumb.firstCrumb.work
                  ? breadcrumb.firstCrumb.work.title
                  : 'Unknown (not available)'}
              </span>
            </ConditionalWrapper>
          </li>
        )}
        {breadcrumb.middleCrumbs.length > 1 && (
          <li>
            <div style={{ position: 'relative', top: '-5px' }}>
              <DropdownButton label="…">
                <ul>
                  {breadcrumb.middleCrumbs.map(crumb => {
                    return (
                      <li key={crumb.path.path} className={`flex`}>
                        <Icon
                          extraClasses={`icon--match-text icon--currentColor`}
                          name={
                            crumb.path.level === 'Item'
                              ? 'digitalImage'
                              : 'folder'
                          }
                        />
                        {crumb.work && crumb.work.id ? (
                          <NextLink {...workLink({ id: crumb.work.id })}>
                            <a className="crumb-inner">
                              {crumb.work.title} {crumb.path.label}
                            </a>
                          </NextLink>
                        ) : (
                          <span className="crumb-inner">
                            Unknown (not available) {crumb.path.path}
                          </span>
                        )}
                      </li>
                    );
                  })}
                </ul>
              </DropdownButton>
            </div>
          </li>
        )}
        {breadcrumb.middleCrumbs.length === 1 && (
          <>
            {breadcrumb.middleCrumbs.map(crumb => {
              return (
                <li key={crumb.work.id} className={'flex'}>
                  <Icon
                    extraClasses={`icon--match-text icon--currentColor`}
                    name={
                      crumb.path.level === 'Item' ? 'digitalImage' : 'folder'
                    }
                  />
                  <NextLink {...workLink({ id: crumb.work.id })}>
                    <a className="crumb-inner">
                      {crumb.work.title} {crumb.path.label}
                    </a>
                  </NextLink>
                </li>
              );
            })}
          </>
        )}
        {breadcrumb.lastCrumb && (
          <li className={'flex'}>
            <Icon
              extraClasses={`icon--match-text icon--currentColor`}
              name={
                breadcrumb.lastCrumb.path.level === 'Item'
                  ? 'digitalImage'
                  : 'folder'
              }
            />
            <span className="crumb-inner">
              {breadcrumb.lastCrumb.work
                ? breadcrumb.lastCrumb.work.title
                : 'Unknown (not available)'}{' '}
              {breadcrumb.lastCrumb.path.label}
            </span>
          </li>
        )}
      </ul>
    </ArchiveBreadcrumbNav>
  );
};

export default ArchiveBreadcrumb;
