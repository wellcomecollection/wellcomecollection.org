import { dataGtmPropsToAttributes } from './gtm';

describe('dataGtmPropsToAttributes', () => {
  it('should return an empty object when no dataGtmProps are provided', () => {
    expect(dataGtmPropsToAttributes()).toEqual({});
  });

  it('should convert dataGtmProps to data-gtm-attributes', () => {
    const input = {
      trigger: 'some_trigger',
      'position-in-list': '1',
    };
    const expectedOutput = {
      'data-gtm-trigger': 'some_trigger',
      'data-gtm-position-in-list': '1',
    };
    expect(dataGtmPropsToAttributes(input)).toEqual(expectedOutput);
  });

  it('should ignore undefined properties', () => {
    const input = {
      trigger: 'some_trigger',
      'undefined-property': undefined,
    };
    const expectedOutput = {
      'data-gtm-trigger': 'some_trigger',
    };
    expect(dataGtmPropsToAttributes(input)).toEqual(expectedOutput);
  });

  it('should handle empty dataGtmProps', () => {
    expect(dataGtmPropsToAttributes({})).toEqual({});
  });
});
