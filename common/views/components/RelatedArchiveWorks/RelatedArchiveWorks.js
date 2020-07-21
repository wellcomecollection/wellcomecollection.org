// @flow
import { type Work } from '@weco/common/model/work';
import styled from 'styled-components';
import { useEffect, useState } from 'react';
import NextLink from 'next/link';
import { classNames, cssGrid, font } from '../../../utils/classnames';
import { getTreeBranches, type Collection } from '@weco/common/utils/works';
import { workLink } from '@weco/common/services/catalogue/routes';
import Layout12 from '@weco/common/views/components/Layout12/Layout12';
import Space from '@weco/common/views/components/styled/Space';
import Icon from '@weco/common/views/components/Icon/Icon';

const WorkLink = styled.a`
  display: block;
  border: 1px solid ${props => props.theme.colors.pewter};
  border-radius: ${props => `${props.theme.borderRadiusUnit}px`};
  padding: ${props => `${props.theme.spacingUnit * 2}px`};
  cursor: pointer;
  min-height: 100px;
  text-decoration: none;
  &:hover,
  &:focus {
    background: ${props => props.theme.colors.charcoal};
    color: ${props => props.theme.colors.white};
  }
`;

type WorksGridProps = {|
  title: string,
  works: Collection[],
|};

const WorksGrid = ({ title, works }: WorksGridProps) => {
  return (
    <Space v={{ size: 'xl', properties: ['margin-bottom'] }}>
      <Layout12>
        <h2
          className={classNames({
            [font('wb', 4)]: true,
          })}
        >
          {title}
        </h2>
      </Layout12>
      <div className="css-grid__container">
        <div className="css-grid">
          {works.map(item => (
            <div
              key={item.path.path}
              className={classNames({
                [cssGrid({
                  s: 12,
                  m: 6,
                  l: 4,
                  xl: 4,
                })]: true,
              })}
            >
              {item.work ? (
                <NextLink
                  {...workLink({ id: item.work.id })}
                  scroll={true}
                  passHref
                >
                  <WorkLink selected={false}>
                    {item.path.level !== 'Item' && (
                      <Space
                        as="span"
                        h={{ size: 'xs', properties: ['margin-right'] }}
                      >
                        <Icon
                          extraClasses={`icon--match-text icon--currentColor`}
                          name="folder"
                        />
                      </Space>
                    )}
                    {item.work.title}
                    <br />
                    {item.path.label}
                  </WorkLink>
                </NextLink>
              ) : (
                <WorkLink>
                  {`Unknown (not available)`}
                  <br />
                  {item.path.label}
                </WorkLink>
              )}
            </div>
          ))}
        </div>
      </div>
    </Space>
  );
};

type Props = {| work: Work |};
const RelatedArchiveWorks = ({ work }: Props) => {
  const [workWithCollection, setWorkWithCollection] = useState({});
  const tree =
    (workWithCollection &&
      workWithCollection.collectionPath &&
      getTreeBranches(
        workWithCollection.collectionPath.path,
        workWithCollection.collection
      )) ||
    [];
  const currentTree = tree[0];
  const parentTree = tree[1];

  useEffect(() => {
    setWorkWithCollection(work);
  }, [work]);

  return workWithCollection ? (
    <>
      {currentTree &&
        currentTree.children &&
        currentTree.children.length > 0 && (
          <WorksGrid
            title={`${
              currentTree.work
                ? currentTree.work.title
                : 'Unknown (not available)'
            } ${currentTree.path.label} contains:`}
            works={currentTree.children}
          />
        )}
      {parentTree && parentTree.children && parentTree.children.length > 0 && (
        <WorksGrid
          title={`Siblings of ${
            currentTree.work
              ? currentTree.work.title
              : 'Unknown (not available)'
          } ${currentTree.path.label}:`}
          works={parentTree.children}
        />
      )}
    </>
  ) : null;
};

export default RelatedArchiveWorks;
