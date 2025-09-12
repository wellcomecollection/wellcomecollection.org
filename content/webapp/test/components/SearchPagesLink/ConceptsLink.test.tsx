import { fromQuery, toQuery, toLink, ConceptsProps } from '@weco/content/views/components/SearchPagesLink/Concepts';

describe('ConceptsLink', () => {
  describe('fromQuery', () => {
    it('handles a query without any values', () => {
      const query = {};
      const conceptsRouteState: ConceptsProps = fromQuery(query);
      expect(conceptsRouteState).toStrictEqual({
        query: '',
        page: 1,
      });
    });

    it('handles a query with values', () => {
      const query = {
        query: 'medicine',
        page: '2',
        notValid: '( ͡° ͜ʖ ͡°)',
      };
      const conceptsRouteState: ConceptsProps = fromQuery(query);

      expect(conceptsRouteState).toStrictEqual({
        query: 'medicine',
        page: 2,
      });
    });

    it('handles a query with string page value', () => {
      const query = {
        query: 'health',
        page: '5',
      };
      const conceptsRouteState: ConceptsProps = fromQuery(query);

      expect(conceptsRouteState).toStrictEqual({
        query: 'health',
        page: 5,
      });
    });

    it('handles empty query string', () => {
      const query = {
        query: '',
        page: '1',
      };
      const conceptsRouteState: ConceptsProps = fromQuery(query);

      expect(conceptsRouteState).toStrictEqual({
        query: '',
        page: 1,
      });
    });
  });

  describe('toQuery', () => {
    it('converts ConceptsProps to query parameters', () => {
      const props: ConceptsProps = {
        query: 'medicine',
        page: 2,
      };
      const query = toQuery(props);

      expect(query).toStrictEqual({
        query: 'medicine',
        page: '2',
      });
    });

    it('handles empty query', () => {
      const props: ConceptsProps = {
        query: '',
        page: 1,
      };
      const query = toQuery(props);

      // Empty values are omitted from the query
      expect(query).toStrictEqual({});
    });
  });

  describe('toLink', () => {
    it('generates correct link for concepts search', () => {
      const partialProps = {
        query: 'medicine',
        page: 2,
      };
      const source = 'search/paginator' as const;
      const link = toLink(partialProps, source);

      expect(link).toStrictEqual({
        href: {
          pathname: '/search/concepts',
          query: {
            query: 'medicine',
            page: '2',
            source: 'search/paginator',
          },
        },
        as: {
          pathname: '/search/concepts',
          query: {
            query: 'medicine',
            page: '2',
          },
        },
      });
    });

    it('generates link with default values for missing props', () => {
      const partialProps = {
        query: 'health',
      };
      const source = 'canonical_link' as const;
      const link = toLink(partialProps, source);

      expect(link).toStrictEqual({
        href: {
          pathname: '/search/concepts',
          query: {
            query: 'health',
            source: 'canonical_link',
          },
        },
        as: {
          pathname: '/search/concepts',
          query: {
            query: 'health',
          },
        },
      });
    });

    it('generates link with empty props', () => {
      const partialProps = {};
      const source = 'unknown' as const;
      const link = toLink(partialProps, source);

      expect(link).toStrictEqual({
        href: {
          pathname: '/search/concepts',
          query: {
            source: 'unknown',
          },
        },
        as: {
          pathname: '/search/concepts',
          query: {},
        },
      });
    });
  });
});