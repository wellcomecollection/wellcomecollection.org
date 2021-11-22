import { Work } from '@weco/common/model/catalogue';
import styled from 'styled-components';
import DropdownButton from '@weco/common/views/components/DropdownButton/DropdownButton';
import Icon from '@weco/common/views/components/Icon/Icon';
import WorkTitle from '../WorkTitle/WorkTitle';
import { getArchiveAncestorArray } from '../../utils/works';
import { FunctionComponent, ReactNode, useContext } from 'react';
import WorkLink from '@weco/common/views/components/WorkLink/WorkLink';
import IsArchiveContext from '../IsArchiveContext/IsArchiveContext';
import { archive, folder } from '@weco/common/icons';
import AlignFont from '@weco/common/views/components/styled/AlignFont';

const ArchiveBreadcrumbNav = styled.nav`
  * {
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
      top: 0;
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
    <AlignFont>
      <WorkLink id={id} source={'archive_tree'}>
        {children}
      </WorkLink>
    </AlignFont>
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
  const isArchive = useContext(IsArchiveContext);

  return isArchive ? (
    <ArchiveBreadcrumbNav>
      <ul>
        {firstCrumb && (
          <li className={'flex'}>
            <Icon matchText={true} color={'currentColor'} icon={archive} />
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
                buttonType={'inline'}
                id="archive-breadcrumbs"
              >
                <ul>
                  {middleCrumbs.map(crumb => {
                    return (
                      <li key={crumb.id} className={`flex`}>
                        <Icon
                          matchText={true}
                          color={'currentColor'}
                          icon={folder}
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
                  <Icon matchText={true} color={'currentColor'} icon={folder} />
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
            <Icon matchText={true} color={'currentColor'} icon={folder} />
            <span className="crumb-inner">
              <AlignFont>
                <WorkTitle
                  title={`${lastCrumb.title}${
                    lastCrumb.referenceNumber
                      ? ` ${lastCrumb.referenceNumber}`
                      : ''
                  }`}
                />
              </AlignFont>
            </span>
          </li>
        )}
      </ul>
    </ArchiveBreadcrumbNav>
  ) : null;
};

export default ArchiveBreadcrumb;
