import { apiErrorMessage } from './api-error-message';

const error = (httpStatus: number, description: string) => ({
  type: 'Error' as const,
  errorType: 'http',
  httpStatus,
  label: 'Error',
  description,
});

describe('apiErrorMessage', () => {
  it("shows the API's description for a 4xx, as it tells the visitor what to change", () => {
    expect(
      apiErrorMessage(
        error(400, 'Only the first 10000 works are available in the API.'),
        'Catalogue API error'
      )
    ).toBe('Only the first 10000 works are available in the API.');
  });

  it('shows the fallback for a 5xx', () => {
    expect(
      apiErrorMessage(
        error(500, 'Elasticsearch timed out'),
        'Catalogue API error'
      )
    ).toBe('Catalogue API error');
  });

  it('shows the fallback for a 4xx with no description', () => {
    expect(apiErrorMessage(error(429, ''), 'Catalogue API error')).toBe(
      'Catalogue API error'
    );
  });
});
