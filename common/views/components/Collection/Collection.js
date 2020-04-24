// @flow
import { type Work } from '@weco/common/model/work';
import { type Node, useEffect, useState } from 'react';
import fetch from 'isomorphic-unfetch';
import styled from 'styled-components';
import Space from '@weco/common/views/components/styled/Space';
import Layout12 from '@weco/common/views/components/Layout12/Layout12';
import { classNames } from '@weco/common/utils/classnames';

type childProps = {| child: any, currentWorkId: string |};
const Child = ({ child, currentWorkId }: childProps) => {
  return (
    <li
      key={child.path.path}
      style={{
        background:
          child.work && child.work.id === currentWorkId ? '#298187' : '',
        color: child.work && child.work.id === currentWorkId ? 'white' : '',
        padding: child.work && child.work.id === currentWorkId ? '2px' : '',
      }}
    >
      {child.path.label || child.path.path}
      {child.work && `: ${child.work.title}`}
      {child.children && (
        <ul>
          {child.children.map(child => (
            <Child
              key={child.path.path}
              child={child}
              currentWorkId={currentWorkId}
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
  useEffect(() => {
    const url = `https://api.wellcomecollection.org/catalogue/v2/works/${work.id}?include=collection`;
    fetch(url)
      .then(resp => resp.json())
      .then(resp => setCollection(resp.collection));
  }, []);

  return collection ? (
    <CollectionContainer>
      <h2
        className="h2"
        style={{
          marginTop: '5px',
          marginBottom: '15px',
          marginLeft: '15px',
        }}
      >
        {collection.work
          ? `${collection.work.title} ${collection.path.label}`
          : collection.path.label || collection.path.path}
      </h2>
      <ul>
        {collection.children.map(child => {
          return (
            <Child
              key={child.path.path}
              child={child}
              currentWorkId={work.id}
            />
          );
        })}
      </ul>
    </CollectionContainer>
  ) : null;
};

export default Collection;
