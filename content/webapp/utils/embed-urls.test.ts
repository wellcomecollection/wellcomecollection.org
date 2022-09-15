import * as prismicT from '@prismicio/types';
import { getYouTubeEmbedUrl } from './embed-urls';

it('creates a privacy-conscious YouTube URL', () => {
  const embed: prismicT.EmbedField = {
    type: 'video',
    height: 113,
    width: 200,
    version: '1.0',
    html: '<iframe width="200" height="113" src="https://www.youtube.com/embed/3bAcmfvJoy4?feature=oembed" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen title="George Vasey describes ‘Athenians Celebrate Bacchus’"></iframe>',
    embed_url: 'https://www.youtube.com/watch?v=3bAcmfvJoy4',
  };

  const url = getYouTubeEmbedUrl(embed);

  expect(url).toBe(
    'https://www.youtube-nocookie.com/embed/3bAcmfvJoy4?rel=0&feature=oembed'
  );
});
