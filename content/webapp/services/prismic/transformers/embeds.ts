import * as prismic from '@prismicio/client';

import { Props as VideoEmbedProps } from '@weco/common/views/components/VideoEmbed';

export function transformVideoEmbed(
  embed: prismic.EmbedField
): (VideoEmbedProps & { title?: string }) | undefined {
  if (embed.provider_name === 'Vimeo') {
    return {
      embedUrl: getVimeoEmbedUrl(embed),
      videoProvider: 'Vimeo',
      videoThumbnail:
        (embed.thumbnail_url_with_play_button as string) || undefined,
      title: embed.title || '',
    };
  }

  if (embed.provider_name === 'YouTube') {
    return {
      embedUrl: getYouTubeEmbedUrl(embed),
      videoProvider: 'YouTube',
      videoThumbnail: embed.thumbnail_url || undefined,
      title: embed.title || '',
    };
  }
}

export function getVimeoEmbedUrl(embed: prismic.EmbedField): string {
  const urlString = embed.html?.match(/src="([-a-zA-Z0-9://.?=_]+)?/)![1] || '';
  const embedUrl = new URL(urlString);
  // There might already be a query so we set 'rel=0' using URL.searchParams
  // to avoid having to determine if it needs to be preceeded by a ? or an &
  embedUrl.searchParams.set('rel', '0');
  return embedUrl.toString();
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
