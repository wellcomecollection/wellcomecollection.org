import { polygonTopAt, splitGradient } from './InPageNavigation.helpers';

describe('polygonTopAt', () => {
  const edge = 'polygon(0% 100%, 20% 60%, 40% 80%, 100% 100%)';

  it('returns the height at a point on the edge', () => {
    expect(polygonTopAt(edge, 20)).toBe(60);
  });

  it('interpolates between points', () => {
    expect(polygonTopAt(edge, 10)).toBe(80);
    expect(polygonTopAt(edge, 30)).toBe(70);
  });

  it('handles the ends', () => {
    expect(polygonTopAt(edge, 0)).toBe(100);
    expect(polygonTopAt(edge, 100)).toBe(100);
  });

  it('returns undefined outside the edge or for an empty polygon', () => {
    expect(polygonTopAt(edge, 120)).toBeUndefined();
    expect(polygonTopAt('none', 50)).toBeUndefined();
  });
});

describe('splitGradient', () => {
  it('splits a flat line straight down the box', () => {
    expect(
      splitGradient({ width: 300, height: 50, leftY: 20, rightY: 20 })
    ).toEqual({ angle: 180, stop: 20 });
  });

  it('angles the gradient to follow a sloped line', () => {
    const { angle, stop } = splitGradient({
      width: 100,
      height: 100,
      leftY: 100,
      rightY: 0,
    });

    // A line from bottom left to top right needs a gradient towards the
    // bottom right, with its stop halfway along
    expect(angle).toBeCloseTo(135);
    expect(stop).toBeCloseTo(Math.hypot(100, 100) / 2);
  });
});
