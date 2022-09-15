import * as prismicT from '@prismicio/types';

export function getYouTubeEmbedUrl(embed: prismicT.EmbedField): string {
  // The embed will be a blob of HTML of the form
  //
  //    <iframe src=\"https://www.youtube.com/embed/RTlA8X0EJ7w...\" ...></iframe>
  //
  // We want to add the query parameter ?rel=0
  // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
  const embedUrl = embed.html!.match(/src="([^"]+)"?/)![1] as string;

  const embedUrlWithEnhancedPrivacy = embedUrl.replace(
    'www.youtube.com',
    'www.youtube-nocookie.com'
  );

  return embedUrl.includes('?')
    ? embedUrlWithEnhancedPrivacy.replace('?', '?rel=0&')
    : `${embedUrlWithEnhancedPrivacy}?rel=0`;
}
