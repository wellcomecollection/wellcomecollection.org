import { renderHook } from '@testing-library/react';

import { getConsentState } from '@weco/common/services/app/civic-uk';

import useVideoEmbed from './useVideoEmbed';

// Loading YouTube's IFrame API sets YouTube's visitor cookies on youtube.com,
// which defeats the point of embedding from youtube-nocookie.com. These tests
// pin down that we only load it once someone has actually chosen to play a
// video, and only with analytics consent.
jest.mock('@weco/common/services/app/civic-uk', () => ({
  getConsentState: jest.fn(),
}));

const mockConsent = getConsentState as jest.Mock;

const youTubeUrl =
  'https://www.youtube-nocookie.com/embed/l0A8-DmX0Z0?rel=0&enablejsapi=1';

const apiScript = () => document.getElementById('youtube-iframe-api');

describe('useVideoEmbed', () => {
  beforeEach(() => {
    mockConsent.mockReturnValue(true);
    apiScript()?.remove();
  });

  it('does not load the YouTube IFrame API before the video is activated', () => {
    renderHook(() => useVideoEmbed(youTubeUrl, 'YouTube'));

    expect(apiScript()).toBeNull();
  });

  it('loads the YouTube IFrame API once the video is activated', () => {
    renderHook(() => useVideoEmbed(youTubeUrl, 'YouTube', true));

    expect(apiScript()).not.toBeNull();
  });

  it('loads the API when a video is activated after first render', () => {
    const { rerender } = renderHook(
      ({ isActive }) => useVideoEmbed(youTubeUrl, 'YouTube', isActive),
      { initialProps: { isActive: false } }
    );

    expect(apiScript()).toBeNull();

    rerender({ isActive: true });

    expect(apiScript()).not.toBeNull();
  });

  it('does not load the API without analytics consent, even when activated', () => {
    mockConsent.mockReturnValue(false);

    renderHook(() => useVideoEmbed(youTubeUrl, 'YouTube', true));

    expect(apiScript()).toBeNull();
  });

  it('does not load the API for Vimeo videos', () => {
    renderHook(() =>
      useVideoEmbed(
        'https://player.vimeo.com/video/123456?rel=0',
        'Vimeo',
        true
      )
    );

    expect(apiScript()).toBeNull();
  });
});
