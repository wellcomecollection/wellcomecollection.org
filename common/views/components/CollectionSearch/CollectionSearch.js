// @flow
import { useEffect, useState } from 'react';
import NextLink from 'next/link';
import fetch from 'isomorphic-unfetch';
import styled from 'styled-components';
import Space from '../styled/Space';
import { workLink } from '../../../services/catalogue/routes';

const Container = styled(Space).attrs({
  h: {
    size: 'm',
    properties: ['padding-left', 'padding-right'],
  },
  v: { size: 's', properties: ['padding-bottom'] },
})`
  background: ${props => props.theme.colors.cream};
  border-top: 5px solid ${props => props.theme.colors.cyan};
`;

type Props = {| query: string |};
const CollectionSearch = ({ query }: Props) => {
  const [collections, setCollections] = useState(null);
  useEffect(() => {
    const url = `https://api.wellcomecollection.org/catalogue/v2/works?collection.depth=1&query=${query}`;
    fetch(url)
      .then(resp => resp.json())
      .then(resp => setCollections(resp));
  }, [query]);

  return (
    <Container>
      <h2
        className="h2"
        style={{
          marginTop: '5px',
          marginBottom: '15px',
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
                  borderTop: '1px solid #298187',
                  padding: '5px',
                  display: 'block',
                }}
              >
                {work.title}
                <h3 className="font-hnm font-size-4 card-link__title"></h3>
              </a>
            </NextLink>
          );
        })}
    </Container>
  );
};

export default CollectionSearch;
