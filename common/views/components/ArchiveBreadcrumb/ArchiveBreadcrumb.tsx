import { Work } from '@weco/common/model/catalogue';
import styled from 'styled-components';
import DropdownButton from '../DropdownButton/DropdownButton';
import Icon from '../Icon/Icon';
import WorkTitle from '@weco/common/views/components/WorkTitle/WorkTitle';
import { getArchiveAncestorArray } from '@weco/common/utils/works';
import { FunctionComponent, ReactNode } from 'react';
import WorkLink from '../WorkLink/WorkLink';

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

type ArchiveWorkLinkProps = {
  id: string;
  children: ReactNode;
};
const ArchiveWorkLink: FunctionComponent<ArchiveWorkLinkProps> = ({
  id,
  children,
}: ArchiveWorkLinkProps) => {
  return (
    <WorkLink id={id} source={'archive_tree'}>
      {children}
    </WorkLink>
  );
};

type Props = {
  work: Work;
};

const ArchiveBreadcrumb: FunctionComponent<Props> = ({ work }: Props) => {
  const archiveAncestorArray = getArchiveAncestorArray(work);
  const firstCrumb = archiveAncestorArray[0];
  const middleCrumbs =
    archiveAncestorArray.length > 1 ? archiveAncestorArray.slice(1) : [];
  const lastCrumb = {
    id: work.id,
    title: work.title,
    alternativeTitles: work.alternativeTitles,
    referenceNumber: work.referenceNumber,
  };
  const isInArchive = work.parts.length > 0 || work.partOf.length > 0;

  return isInArchive ? (
    <ArchiveBreadcrumbNav>
      <ul>
        {firstCrumb && (
          <li className={'flex'}>
            <Icon matchText={true} color={'currentColor'} name={`archive`} />
            <ArchiveWorkLink id={firstCrumb.id}>
              <a className="crumb-inner">
                <WorkTitle title={firstCrumb.title} />
              </a>
            </ArchiveWorkLink>
          </li>
        )}
        {middleCrumbs.length > 1 && (
          <li>
            <div style={{ position: 'relative', top: '-5px' }}>
              <DropdownButton
                label="…"
                isInline={true}
                id="archive-breadcrumbs"
              >
                <ul>
                  {middleCrumbs.map(crumb => {
                    return (
                      <li key={crumb.id} className={`flex`}>
                        <Icon
                          matchText={true}
                          color={'currentColor'}
                          name={
                            'folder'
                            // TODO: no longer way of knowing if has children
                            // crumb.path.level === 'Item'
                            //   ? 'digitalImage'
                            //   : 'folder'
                          }
                        />
                        <ArchiveWorkLink id={crumb.id}>
                          <a className="crumb-inner">
                            <WorkTitle
                              title={`${crumb.title} ${crumb.referenceNumber}`}
                            />
                          </a>
                        </ArchiveWorkLink>
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
                    matchText={true}
                    color={'currentColor'}
                    name={
                      'folder'
                      // TODO: no longer way of knowing if has children
                      // crumb.path.level === 'Item' ? 'digitalImage' : 'folder'
                    }
                  />
                  <ArchiveWorkLink id={crumb.id}>
                    <a className="crumb-inner">
                      <WorkTitle
                        title={`${crumb.title} ${crumb.referenceNumber}`}
                      />
                    </a>
                  </ArchiveWorkLink>
                </li>
              );
            })}
          </>
        )}
        {lastCrumb && (
          <li className={'flex'}>
            <Icon
              matchText={true}
              color={'currentColor'}
              name={
                'folder'
                // TODO: no longer way of knowing if has children
                // lastCrumb.path.level === 'Item' ? 'digitalImage' : 'folder'
              }
            />
            <span className="crumb-inner">
              <WorkTitle
                title={`${lastCrumb.title} ${lastCrumb.referenceNumber}`}
              />
            </span>
          </li>
        )}
      </ul>
    </ArchiveBreadcrumbNav>
  ) : null;
};

export default ArchiveBreadcrumb;
