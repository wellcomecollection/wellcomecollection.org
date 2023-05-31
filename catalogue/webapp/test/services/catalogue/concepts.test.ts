import { getConcept } from '@weco/catalogue/services/wellcome/catalogue/concepts';

it('returns a 404 Not Found for a concept ID that is not alphanumeric', () => {
  const id = 'a\u200Bb';

  getConcept({ id, toggles: {} }).then(result => {
    expect(result).toStrictEqual({
      errorType: 'http',
      httpStatus: 404,
      label: 'Not Found',
      description: '',
      type: 'Error',
    });
  });
});
