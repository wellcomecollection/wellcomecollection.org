import { FunctionComponent, PropsWithChildren, useContext } from 'react';
import styled from 'styled-components';

import { archive, folder } from '@weco/common/icons';
import Button from '@weco/common/views/components/Buttons';
import Icon from '@weco/common/views/components/Icon';
import WorkLink from '@weco/content/components/WorkLink';
import WorkTitle from '@weco/content/components/WorkTitle';
import IsArchiveContext from '@weco/content/contexts/IsArchiveContext';
import { Work } from '@weco/content/services/wellcome/catalogue/types';
import { getArchiveAncestorArray } from '@weco/content/utils/works';

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

  /* Ignoring linting here as it's quite complex */
  /* stylelint-disable no-descending-specificity */
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

    &::after {
      content: '>';
      position: absolute;
      top: 0;
      right: -15px;
      color: #888;
    }

    &:last-child {
      &::after {
        display: none;
      }
    }

    ul {
      display: block;
      white-space: normal;

      li {
        margin-bottom: 1px;

        &::after {
          display: none;
        }

        &:last-child {
          &::after {
            display: none;
          }
        }
      }
    }
  }
  /* stylelint-enable no-descending-specificity */
`;

type ArchiveWorkLinkProps = PropsWithChildren<{
  id: string;
}>;
const ArchiveWorkLink: FunctionComponent<ArchiveWorkLinkProps> = ({
  id,
  children,
}) => {
  return (
    <WorkLink id={id} source="archive_tree">
      {children}
    </WorkLink>
  );
};

type Props = {
  work: Work;
};

const ArchiveBreadcrumb: FunctionComponent<Props> = ({ work }) => {
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
          <li style={{ display: 'flex' }}>
            <Icon matchText={true} icon={archive} />
            <ArchiveWorkLink id={firstCrumb.id}>
              <a
                className="crumb-inner"
                data-gtm-trigger="work_breadcrumb_link"
              >
                <WorkTitle title={firstCrumb.title} />
              </a>
            </ArchiveWorkLink>
          </li>
        )}
        {middleCrumbs.length > 1 && (
          <li>
            <div style={{ position: 'relative', top: '-5px' }}>
              <Button
                variant="DropdownButton"
                label="…"
                buttonType="inline"
                id="archive-breadcrumbs"
              >
                <ul>
                  {middleCrumbs.map(crumb => {
                    return (
                      <li key={crumb.id} style={{ display: 'flex' }}>
                        <Icon matchText={true} icon={folder} />
                        <ArchiveWorkLink id={crumb.id}>
                          <a
                            className="crumb-inner"
                            data-gtm-trigger="work_breadcrumb_link"
                          >
                            <WorkTitle
                              title={`${crumb.title} ${crumb.referenceNumber}`}
                            />
                          </a>
                        </ArchiveWorkLink>
                      </li>
                    );
                  })}
                </ul>
              </Button>
            </div>
          </li>
        )}
        {middleCrumbs.length === 1 && (
          <>
            {middleCrumbs.map(crumb => {
              return (
                <li key={crumb.id} style={{ display: 'flex' }}>
                  <Icon matchText={true} icon={folder} />
                  <ArchiveWorkLink id={crumb.id}>
                    <a
                      className="crumb-inner"
                      data-gtm-trigger="work_breadcrumb_link"
                    >
                      <WorkTitle
                        title={`${crumb.title}${
                          crumb.referenceNumber
                            ? ` ${crumb.referenceNumber}`
                            : ''
                        }`}
                      />
                    </a>
                  </ArchiveWorkLink>
                </li>
              );
            })}
          </>
        )}
        {lastCrumb && (
          <li style={{ display: 'flex' }}>
            <Icon matchText={true} icon={folder} />
            <span className="crumb-inner">
              <WorkTitle
                title={`${lastCrumb.title}${
                  lastCrumb.referenceNumber
                    ? ` ${lastCrumb.referenceNumber}`
                    : ''
                }`}
              />
            </span>
          </li>
        )}
      </ul>
    </ArchiveBreadcrumbNav>
  ) : null;
};

export default ArchiveBreadcrumb;
