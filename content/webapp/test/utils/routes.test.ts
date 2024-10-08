import { ParsedUrlQuery } from 'querystring';

import {
  QueryParam,
  toCsv,
  toMaybeNumber,
  toMaybeString,
  toNumber,
  toString,
} from '@weco/common/utils/routes';

const params: ParsedUrlQuery = {
  // &string=string
  string: 'string',
  // &stringArray=string&stringArray=strong
  stringArray: ['string', 'strong'],
  // &emptyString=
  emptyString: '',
  // &numberString=7
  numberString: '7',
  nodef: undefined,
};

function testWithParams<T>(f: (param: QueryParam) => T, expected) {
  const test = Object.entries(params).reduce((acc, [key, val]) => {
    return {
      ...acc,
      [key]: f(val),
    };
  }, {});

  expect(test).toStrictEqual(expected);
}

describe('ParsedUrlQuery parsers', () => {
  it('toCsv', () => {
    testWithParams(toCsv, {
      string: ['string'],
      stringArray: ['string', 'strong'],
      emptyString: [],
      numberString: ['7'],
      nodef: [],
    });
  });

  it('toNumber', () => {
    testWithParams(param => toNumber(param, 10), {
      string: 10,
      stringArray: 10,
      emptyString: 10,
      numberString: 7,
      nodef: 10,
    });
  });

  it('toString', () => {
    testWithParams(param => toString(param, 'fallback'), {
      string: 'string',
      stringArray: 'string,strong',
      emptyString: '',
      numberString: '7',
      nodef: 'fallback',
    });
  });

  it('toMaybeNumber', () => {
    testWithParams(toMaybeNumber, {
      string: undefined,
      stringArray: undefined,
      emptyString: undefined,
      numberString: 7,
      nodef: undefined,
    });
  });

  it('toMaybeString', () => {
    testWithParams(toMaybeString, {
      string: 'string',
      stringArray: 'string,strong',
      emptyString: undefined,
      numberString: '7',
      nodef: undefined,
    });
  });
});
