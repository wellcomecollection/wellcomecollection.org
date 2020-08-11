// @flow
import { useEffect, useState, useContext } from 'react';
import NextLink from 'next/link';
import fetch from 'isomorphic-unfetch';
import styled from 'styled-components';
import Space from '../styled/Space';
import TogglesContext from '../TogglesContext/TogglesContext';
import { workLink } from '../../../services/catalogue/routes';

const Container = styled(Space).attrs({
  h: {
    size: 'm',
    properties: ['padding-left', 'padding-right'],
  },
  v: { size: 's', properties: ['padding-bottom'] },
})`
  border-top: 1px solid ${props => props.theme.color('cyan')};
  border-bottom: 1px solid ${props => props.theme.color('cyan')};
  border-left: 1px solid ${props => props.theme.color('cream')};
  border-right: 1px solid ${props => props.theme.color('cream')};
`;

type Props = {| query: string |};
const CollectionSearch = ({ query }: Props) => {
  const [collections, setCollections] = useState(null);
  const { stagingApi } = useContext(TogglesContext);
  useEffect(() => {
    const url = `https://api${
      stagingApi ? '-stage' : ''
    }.wellcomecollection.org/catalogue/v2/works?collection.depth=1&query=${query}`;
    fetch(url)
      .then(resp => resp.json())
      .then(resp => setCollections(resp));
  }, [query]);

  return (
    <Container>
      <h2
        className="h2"
        style={{
          marginTop: '10px',
          marginBottom: '10px',
        }}
      >
        Collections
      </h2>
      {collections &&
        collections.results.map(work => {
          return (
            <NextLink key={work.id} {...workLink({ id: work.id })}>
              <a
                className="plain-link"
                style={{
                  borderTop: '1px solid #e8e8e8',
                  padding: '10px 0',
                  display: 'block',
                }}
              >
                {work.title}
              </a>
            </NextLink>
          );
        })}
    </Container>
  );
};

export default CollectionSearch;
