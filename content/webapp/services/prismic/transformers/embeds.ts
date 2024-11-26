import * as prismic from '@prismicio/client';

export function getVimeoEmbedUrl(embed: prismic.EmbedField): string {
  const embedUrl = embed.html?.match(/src="([-a-zA-Z0-9://.?=_]+)?/)![1];

  return `${embedUrl}?rel=0`;
}

export function getSoundCloudEmbedUrl(embed: prismic.EmbedField): string {
  const apiUrl = embed.html!.match(/url=([^&]*)&/)!;

  const secretToken = embed.html!.match(/secret_token=([^"]*)"/);
  const secretTokenString =
    secretToken && secretToken[1] ? `%3Fsecret_token%3D${secretToken[1]}` : '';

  return `https://w.soundcloud.com/player/?url=${apiUrl[1]}${secretTokenString}&color=%23ff5500&inverse=false&auto_play=false&show_user=true`;
}

export function getYouTubeEmbedUrl(embed: prismic.EmbedField): string {
  // The embed will be a blob of HTML of the form
  //
  //    <iframe src=\"https://www.youtube.com/embed/RTlA8X0EJ7w...\" ...></iframe>
  //
  // We want to add the query parameter ?rel=0

  const embedUrl = embed.html!.match(/src="([^"]+)"?/)![1];

  const embedUrlWithEnhancedPrivacy = embedUrl.replace(
    'www.youtube.com',
    'www.youtube-nocookie.com'
  );

  return embedUrl.includes('?')
    ? embedUrlWithEnhancedPrivacy.replace('?', '?rel=0&')
    : `${embedUrlWithEnhancedPrivacy}?rel=0`;
}
