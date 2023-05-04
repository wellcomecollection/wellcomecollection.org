import { getThumbnailImage } from './canvas';

describe('getThumbnailImage', () => {
  it('if there’s no thumbnail on the canvas', () => {
    const canvas = {};
    expect(getThumbnailImage(canvas as any)).toBeUndefined();
  });
});
