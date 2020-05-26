// @flow
import { type Work } from '@weco/common/model/work';
import { useEffect, useState } from 'react';
import fetch from 'isomorphic-unfetch';

// TODO flow
function addMathchingPathIndex(
  currentWorkPath,
  children = [],
  indicesArray = []
) {
  const matchingIndex = children.findIndex(work => {
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
function getMatchingPathIndices(currentWorkPath, children) {
  const indicesArray = [];
  addMathchingPathIndex(currentWorkPath, children, indicesArray);
  return indicesArray.filter(v => v >= 0);
}

function getWorkChildren(tree = { children: [] }, indicesArray = []) {
  let childrenAtIndex = tree.children;
  for (let i of indicesArray) {
    childrenAtIndex = childrenAtIndex[i].children;
  }
  return childrenAtIndex;
}

function getWorkSiblings(tree, indicesArray) {
  // TODO filter out OR highlight the one current looking at?
  const parentsIndicesArray = indicesArray.slice(0, indicesArray.length - 1);
  const parentTree = getWorkChildren(tree, parentsIndicesArray);
  return parentTree.map(work => ({
    ...work,
    children: [],
  }));
}

type Props = {| work: Work |};
const ArchiveWorkChildren = ({ work }: Props) => {
  const [collection, setCollection] = useState();
  const { currentWorkPath = '', tree = { children: [] } } = collection || {};

  const matchingPathIndices = getMatchingPathIndices(
    currentWorkPath,
    tree.children
  );
  const workChildren = getWorkChildren(tree, matchingPathIndices);
  const workSiblings = getWorkSiblings(tree, matchingPathIndices);

  useEffect(() => {
    // TODO change to awaits
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
      <h2>Children</h2>
      <pre
        style={{
          maxWidth: '600px',
          margin: '0 auto 24px',
          fontSize: '14px',
        }}
      >
        <code
          style={{
            display: 'block',
            padding: '24px',
            backgroundColor: '#EFE1AA',
            color: '#000',
            border: '4px solid #000',
            borderRadius: '6px',
          }}
        >
          {JSON.stringify(workChildren, null, 1)}
        </code>
      </pre>
      <h2>Siblings</h2>
      <pre
        style={{
          maxWidth: '600px',
          margin: '0 auto 24px',
          fontSize: '14px',
        }}
      >
        <code
          style={{
            display: 'block',
            padding: '24px',
            backgroundColor: '#EFE1AA',
            color: '#000',
            border: '4px solid #000',
            borderRadius: '6px',
          }}
        >
          {JSON.stringify(workSiblings, null, 1)}
        </code>
      </pre>
    </>
  ) : null;
};

export default ArchiveWorkChildren;
