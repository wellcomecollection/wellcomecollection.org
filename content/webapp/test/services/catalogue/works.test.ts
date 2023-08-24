import { getWork } from '@weco/content/services/wellcome/catalogue/works';

it('returns a 404 Not Found for a work ID that’s not alphanumeric', () => {
  const id = 'a\u200Bb';

  getWork({ id, toggles: {} }).then(result => {
    expect(result).toStrictEqual({
      errorType: 'http',
      httpStatus: 404,
      label: 'Not Found',
      description: '',
      type: 'Error',
    });
  });
});
