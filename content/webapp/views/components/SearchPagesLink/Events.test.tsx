import { getEventFormats } from './Events';

describe('getEventFormats', () => {
  it('excludes exhibitions by default when paramsFormat is empty', () => {
    const result = getEventFormats({
      paramsFormat: [],
    });
    expect(result).toStrictEqual({
      apiFormat: ['!exhibitions'],
      uiFormat: [],
    });
  });

  it('excludes exhibitions by default when paramsFormat has values', () => {
    const result = getEventFormats({
      paramsFormat: ['W'],
    });
    expect(result).toStrictEqual({
      apiFormat: ['W', '!exhibitions'],
      uiFormat: ['W'],
    });
  });

  it('excludes exhibitions explicitly when paramsFormat is empty', () => {
    const result = getEventFormats({
      paramsFormat: [],
      excludeExhibitions: true,
    });
    expect(result).toStrictEqual({
      apiFormat: ['!exhibitions'],
      uiFormat: [],
    });
  });

  it('excludes exhibitions explicitly when paramsFormat has values', () => {
    const result = getEventFormats({
      paramsFormat: ['W'],
      excludeExhibitions: true,
    });
    expect(result).toStrictEqual({
      apiFormat: ['W', '!exhibitions'],
      uiFormat: ['W'],
    });
  });

  it('does not exclude exhibitions when excludeExhibitions is false and paramsFormat is empty', () => {
    const result = getEventFormats({
      paramsFormat: [],
      excludeExhibitions: false,
    });
    expect(result).toStrictEqual({
      apiFormat: [],
      uiFormat: [],
    });
  });

  it('does not exclude exhibitions when excludeExhibitions is false and paramsFormat has values', () => {
    const result = getEventFormats({
      paramsFormat: ['W'],
      excludeExhibitions: false,
    });
    expect(result).toStrictEqual({
      apiFormat: ['W'],
      uiFormat: ['W'],
    });
  });
});
