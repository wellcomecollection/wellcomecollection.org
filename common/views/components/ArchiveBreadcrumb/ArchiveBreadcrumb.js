// @flow
import { type Work } from '@weco/common/model/work';
import { workLink } from '../../../services/catalogue/routes';
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

const ArchiveBreadcrumb = ({ work }: Props) => {
  const firstCrumb = work.partOf[0];
  const middleCrumbs = work.partOf.length > 1 ? work.partOf.slice(1) : [];
  const lastCrumb = {
    id: work.id,
    title: work.title,
    alternativeTitles: work.alternativeTitles,
    referenceNumber: work.referenceNumber,
  };

  return (
    <ArchiveBreadcrumbNav>
      <ul>
        {firstCrumb && (
          <li className={'flex'}>
            <Icon
              extraClasses={`icon--match-text icon--currentColor`}
              name={`archive`}
            />
            <NextLink {...workLink({ id: firstCrumb.id })}>
              <a className="crumb-inner">{firstCrumb.title}</a>
            </NextLink>
          </li>
        )}
        {middleCrumbs.length > 1 && (
          <li>
            <div style={{ position: 'relative', top: '-5px' }}>
              <DropdownButton label="…" isInline={true}>
                <ul>
                  {middleCrumbs.map(crumb => {
                    return (
                      <li key={crumb.id} className={`flex`}>
                        <Icon
                          extraClasses={`icon--match-text icon--currentColor`}
                          name={
                            'folder'
                            // TODO no longer way of knowing if has children
                            // crumb.path.level === 'Item'
                            //   ? 'digitalImage'
                            //   : 'folder'
                          }
                        />
                        <NextLink {...workLink({ id: crumb.id })}>
                          <a className="crumb-inner">
                            {crumb.title} {crumb.referenceNumber}
                          </a>
                        </NextLink>
                      </li>
                    );
                  })}
                </ul>
              </DropdownButton>
            </div>
          </li>
        )}
        {middleCrumbs.length === 1 && (
          <>
            {middleCrumbs.map(crumb => {
              return (
                <li key={crumb.id} className={'flex'}>
                  <Icon
                    extraClasses={`icon--match-text icon--currentColor`}
                    name={
                      'folder'
                      // TODO no longer way of knowing if has children
                      // crumb.path.level === 'Item' ? 'digitalImage' : 'folder'
                    }
                  />
                  <NextLink {...workLink({ id: crumb.id })}>
                    <a className="crumb-inner">
                      {crumb.title} {crumb.referenceNumber}
                    </a>
                  </NextLink>
                </li>
              );
            })}
          </>
        )}
        {lastCrumb && (
          <li className={'flex'}>
            <Icon
              extraClasses={`icon--match-text icon--currentColor`}
              name={
                'folder'
                // TODO no longer way of knowing if has children
                // lastCrumb.path.level === 'Item' ? 'digitalImage' : 'folder'
              }
            />
            <span className="crumb-inner">
              {lastCrumb.title} {lastCrumb.referenceNumber}
            </span>
          </li>
        )}
      </ul>
    </ArchiveBreadcrumbNav>
  );
};

export default ArchiveBreadcrumb;
