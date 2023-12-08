import { fromQuery, WorksProps } from './Works';

describe('WorksLink', () => {
  describe('fromQuery', () => {
    it('handles a query without any values', () => {
      const query = {};
      const worksRouteState: WorksProps = fromQuery(query);
      expect(worksRouteState).toStrictEqual({
        query: '',
        page: 1,
        workType: [],
        'items.locations.locationType': [],
        availabilities: [],
        sort: undefined,
        sortOrder: undefined,
        'partOf.title': undefined,
        'production.dates.from': undefined,
        'production.dates.to': undefined,
        'genres.concepts': [],
        'genres.label': [],
        'subjects.label': [],
        languages: [],
        'contributors.agent.label': [],
      });
    });

    it('handles a query with values', () => {
      const query = {
        query: 'gargoyles',
        page: '3',
        workType: 'a,b,c',
        'production.dates.from': '1500',
        'production.dates.to': '1900',
        notValid: '( ͡° ͜ʖ ͡°)',
      };
      const worksRouteState: WorksProps = fromQuery(query);

      expect(worksRouteState).toStrictEqual({
        query: 'gargoyles',
        page: 3,
        workType: ['a', 'b', 'c'],
        'items.locations.locationType': [],
        availabilities: [],
        sort: undefined,
        sortOrder: undefined,
        'partOf.title': undefined,
        'production.dates.from': '1500',
        'production.dates.to': '1900',
        'genres.concepts': [],
        'genres.label': [],
        'subjects.label': [],
        languages: [],
        'contributors.agent.label': [],
      });
    });
  });
});
