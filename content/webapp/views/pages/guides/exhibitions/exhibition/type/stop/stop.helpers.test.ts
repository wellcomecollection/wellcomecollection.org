import { getStopLinks } from './stop.helpers';

const guideTypeUrl =
  '/guides/exhibitions/an-exhibition/audio-without-descriptions';

describe('getStopLinks', () => {
  it('has no previous link on the first stop', () => {
    const { previous, next } = getStopLinks({
      guideTypeUrl,
      stopNumber: 1,
      totalStops: 5,
    });

    expect(previous).toBeUndefined();
    expect(next).toEqual({
      href: { pathname: `${guideTypeUrl}/2` },
      shallow: true,
    });
  });

  it('has no next link on the last stop', () => {
    const { previous, next } = getStopLinks({
      guideTypeUrl,
      stopNumber: 5,
      totalStops: 5,
    });

    expect(previous).toEqual({
      href: { pathname: `${guideTypeUrl}/4` },
      shallow: true,
    });
    expect(next).toBeUndefined();
  });

  it('has neither when there is only one stop', () => {
    expect(
      getStopLinks({ guideTypeUrl, stopNumber: 1, totalStops: 1 })
    ).toEqual({ previous: undefined, next: undefined });
  });
});
