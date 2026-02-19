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
        'items.locations.accessConditions.status': [],
        'items.locations.createdDate.to': undefined,
        'items.locations.createdDate.from': undefined,
        availabilities: [],
        sort: undefined,
        sortOrder: undefined,
        'partOf.title': undefined,
        'production.dates.from': undefined,
        'production.dates.to': undefined,
        'genres.concepts': [],
        'genres.label': [],
        'subjects.label': [],
        'subjects.concepts': [],
        languages: [],
        'contributors.agent.label': [],
        'contributors.concepts': [],
        identifiers: [],
      });
    });

    it('handles a query with values', () => {
      const query = {
        query: 'gargoyles',
        page: '3',
        workType: 'a,b,c',
        'production.dates.from': '1500',
        'production.dates.to': '1900',
        'items.locations.createdDate.from': '2020-01-01',
        notValid: '( ͡° ͜ʖ ͡°)',
      };
      const worksRouteState: WorksProps = fromQuery(query);

      expect(worksRouteState).toStrictEqual({
        query: 'gargoyles',
        page: 3,
        workType: ['a', 'b', 'c'],
        'items.locations.locationType': [],
        'items.locations.accessConditions.status': [],
        'items.locations.createdDate.from': '2020-01-01',
        'items.locations.createdDate.to': undefined,
        availabilities: [],
        sort: undefined,
        sortOrder: undefined,
        'partOf.title': undefined,
        'production.dates.from': '1500',
        'production.dates.to': '1900',
        'genres.concepts': [],
        'genres.label': [],
        'subjects.label': [],
        'subjects.concepts': [],
        languages: [],
        'contributors.agent.label': [],
        'contributors.concepts': [],
        identifiers: [],
      });
    });
  });
});
