// @flow
import { type Work } from '@weco/common/model/work';
import styled from 'styled-components';
import { useEffect, useState } from 'react';
import NextLink from 'next/link';
import fetch from 'isomorphic-unfetch';
import { classNames, cssGrid, font } from '../../../utils/classnames';
import { workLink } from '@weco/common/services/catalogue/routes';
import Layout12 from '@weco/common/views/components/Layout12/Layout12';
import Space from '@weco/common/views/components/styled/Space';

type Collection = {|
  path: {|
    path: string,
    level: string,
    label: string,
    type: string,
  |},
  work: {|
    id: string,
    title: string,
    alternativeTitles: [],
    type: 'Work',
  |},
  children: ?(Collection[]),
|};

// TODO flow
function addMathchingPathIndex(
  currentWorkPath,
  children = [],
  indicesArray = []
) {
  const matchingIndex =
    children &&
    children.findIndex(work => {
      const currentPathLength = currentWorkPath.split('/').length;
      const currentWorkPathLength = work.path.path.split('/').length;
      if (
        currentWorkPathLength < currentPathLength &&
        currentWorkPath.includes(work.path.path)
      ) {
        addMathchingPathIndex(currentWorkPath, work.children, indicesArray);
        return true;
      } else if (currentWorkPath === work.path.path) {
        return true;
      }
    });
  indicesArray.unshift(matchingIndex);
}
// TODO flow
function getMatchingPathIndices({
  currentWorkPath,
  children,
}: {
  currentWorkPath: string,
  children: Collection[],
}): number[] {
  const indicesArray = [];
  addMathchingPathIndex(currentWorkPath, children, indicesArray);
  return indicesArray.map(index => Number(index)).filter(v => v >= 0);
}

function getWorkChildren(tree = { children: [] }, indicesArray = []) {
  let childrenAtIndex = tree.children;
  for (let i of indicesArray) {
    childrenAtIndex = childrenAtIndex && childrenAtIndex[i].children;
  }
  return childrenAtIndex;
}

function getWorkSiblings(tree, indicesArray) {
  const parentsIndicesArray = indicesArray.slice(0, indicesArray.length - 1);
  const parentTree = getWorkChildren(tree, parentsIndicesArray);
  return (
    parentTree &&
    parentTree.map(work => ({
      ...work,
      children: [],
    }))
  );
}

const WorkLink = styled.a`
  display: block;
  border: 1px solid ${props => props.theme.colors.pewter};
  border-radius: ${props => `${props.theme.borderRadiusUnit}px`};
  padding: ${props => `${props.theme.spacingUnit * 2}px`};
  cursor: pointer;
  height: 100px;
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
              key={item.work.id}
              className={classNames({
                [cssGrid({
                  s: 12,
                  m: 6,
                  l: 4,
                  xl: 4,
                })]: true,
              })}
            >
              <NextLink
                {...workLink({ id: item.work.id })}
                scroll={false}
                passHref
              >
                <WorkLink selected={false}>
                  {item.work.title} {item.path.path}
                </WorkLink>
              </NextLink>
            </div>
          ))}
        </div>
      </div>
    </Space>
  );
};

type Props = {| work: Work |};
const RelatedArchiveWorks = ({ work }: Props) => {
  const [collection, setCollection] = useState();
  const { currentWorkPath = '', tree = { children: [] } } = collection || {};

  const matchingPathIndices = getMatchingPathIndices({
    currentWorkPath,
    children: tree.children,
  });
  const workChildren = getWorkChildren(tree, matchingPathIndices) || [];
  const workSiblings = getWorkSiblings(tree, matchingPathIndices) || [];

  useEffect(() => {
    const url = `https://api.wellcomecollection.org/catalogue/v2/works/${work.id}?include=collection`;
    fetch(url)
      .then(resp => resp.json())
      .then(resp => {
        setCollection({
          currentWorkPath: resp.collectionPath.path,
          tree: resp.collection,
        });
      });
  }, [work.id]);

  return collection ? (
    <>
      {workChildren.length > 0 && (
        <WorksGrid
          title={`Items in: ${work.title} ${currentWorkPath}`}
          works={workChildren}
        />
      )}
      {workSiblings.length > 0 && (
        <WorksGrid title={`More items at this level`} works={workSiblings} />
      )}
    </>
  ) : null;
};

export default RelatedArchiveWorks;
