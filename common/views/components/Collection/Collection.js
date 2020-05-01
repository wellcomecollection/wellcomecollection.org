// @flow
import { type Work } from '@weco/common/model/work';
import { type Node, useEffect, useState } from 'react';
import fetch from 'isomorphic-unfetch';
import NextLink from 'next/link';
import styled from 'styled-components';
import Space from '@weco/common/views/components/styled/Space';
import Layout12 from '@weco/common/views/components/Layout12/Layout12';
import { classNames } from '@weco/common/utils/classnames';
import { workLink } from '@weco/common/services/catalogue/routes';

type ChildProps = {|
  child: any,
  currentWorkPath: string,
  expandedPaths: string[],
  setExpandedPaths: (string[]) => void,
|};
const Child = ({
  child,
  currentWorkPath,
  expandedPaths,
  setExpandedPaths,
}: ChildProps) => {
  const isExpanded = child.children || expandedPaths.includes(child.path.path);
  const canToggleExpanded = !currentWorkPath.startsWith(child.path.path);
  return (
    <li
      key={child.path.path}
      id={child.work ? `collection-${child.work.id}` : ''}
      style={{
        listStyle: 'none',
        padding: 0,
        margin: 0,
      }}
    >
      <div style={{ display: 'flex' }}>
        <div
          onClick={
            canToggleExpanded
              ? () =>
                  setExpandedPaths(
                    isExpanded
                      ? expandedPaths.filter(
                          path => !path.startsWith(child.path.path)
                        )
                      : expandedPaths.concat(child.path.path)
                  )
              : null
          }
          style={{
            cursor: canToggleExpanded ? 'pointer' : 'default',
            width: '30px',
            textAlign: 'center',
            padding: '5px',
            color: '#298187',
            fontWeight: 'bold',
          }}
        >
          {isExpanded ? '-' : '+'}
        </div>
        {child.work && (
          <NextLink {...workLink({ id: child.work.id })} scroll={false}>
            <a
              className="plain-link"
              style={{
                borderTop: '1px solid #298187',
                width: '100%',
                marginLeft: '10px',
                padding: '5px',
                background:
                  child.path.path === currentWorkPath ? '#298187' : '',
                color: child.path.path === currentWorkPath ? 'white' : '',
              }}
            >
              {child.path.label || child.path.path}
              {child.work && `: ${child.work.title}`}
            </a>
          </NextLink>
        )}
        {!child.work && (
          <div
            style={{
              background: child.path.path === currentWorkPath ? '#298187' : '',
              color: child.path.path === currentWorkPath ? 'white' : '',
            }}
          >
            {child.path.label || child.path.path}
            {child.work && `: ${child.work.title}`}
          </div>
        )}
      </div>
      {child.children && (
        <ul>
          {child.children.map(child => (
            <Child
              key={child.path.path}
              child={child}
              currentWorkPath={currentWorkPath}
              expandedPaths={expandedPaths}
              setExpandedPaths={setExpandedPaths}
            />
          ))}
        </ul>
      )}
    </li>
  );
};

const ContainerInner = styled.div`
  background: ${props => props.theme.colors.cream};
  border-top: 5px solid ${props => props.theme.colors.cyan};
`;
type CollectionContainerProps = {| children: Node |};
const CollectionContainer = ({ children }: CollectionContainerProps) => {
  return (
    <Space
      v={{
        size: 'xl',
        properties: ['padding-bottom'],
      }}
      className={classNames({
        row: true,
      })}
    >
      <Layout12>
        <ContainerInner>{children}</ContainerInner>
      </Layout12>
    </Space>
  );
};

type Props = {| work: Work |};
const Collection = ({ work }: Props) => {
  const [collection, setCollection] = useState();
  const [expandedPaths, setExpandedPaths] = useState([]);
  useEffect(() => {
    const url = `https://api.wellcomecollection.org/catalogue/v2/works/${
      work.id
    }?include=collection&_expandPaths=${expandedPaths.join(',')}`;
    fetch(url)
      .then(resp => resp.json())
      .then(resp =>
        setCollection({
          currentWorkPath: resp.collectionPath.path,
          tree: resp.collection,
        })
      );
  }, [work.id, expandedPaths]);
  useEffect(() => setExpandedPaths([]), [work.id]);

  return collection ? (
    <CollectionContainer>
      <h2
        className="h2"
        style={{
          marginTop: '5px',
          marginBottom: '15px',
          marginLeft: '15px',
        }}
        name="collection"
        id="collection"
      >
        {collection.tree.work
          ? `${collection.tree.work.title} ${collection.tree.path.label}`
          : collection.tree.path.label || collection.tree.path.path}
      </h2>
      <ul style={{ padding: 0 }}>
        {collection.tree.children.map(child => {
          return (
            <Child
              key={child.path.path}
              child={child}
              currentWorkPath={collection.currentWorkPath}
              expandedPaths={expandedPaths}
              setExpandedPaths={setExpandedPaths}
            />
          );
        })}
      </ul>
    </CollectionContainer>
  ) : null;
};

export default Collection;
