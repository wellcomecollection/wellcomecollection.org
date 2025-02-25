import * as prismic from '@prismicio/client';

import { Venue } from '@weco/common/model/opening-hours';
import {
  ArticlesDocument as RawArticlesDocument,
  AudioPlayerSlice as RawAudioPlayerSlice,
  CardDocument as RawCardDocument,
  CollectionVenueSlice as RawCollectionVenueSlice,
  ContactSlice as RawContactSlice,
  ContentListSlice as RawContentListSlice,
  EditorialImageGallerySlice as RawEditorialImageGallerySlice,
  EditorialImageSlice as RawEditorialImageSlice,
  EmbedSlice as RawEmbedSlice,
  EventsDocument as RawEventsDocument,
  EventSeriesDocument as RawEventSeriesDocument,
  ExhibitionsDocument as RawExhibitionsDocument,
  GifVideoSlice as RawGifVideoSlice,
  GuidesDocument as RawGuidesDocument,
  IframeSlice as RawIframeSlice,
  InfoBlockSlice as RawInfoBlockSlice,
  MapSlice as RawMapSlice,
  PagesDocument as RawPagesDocument,
  QuoteSlice as RawQuoteSlice,
  SearchResultsSlice as RawSearchResultsSlice,
  SeasonsDocument as RawSeasonsDocument,
  StandfirstSlice as RawStandfirstSlice,
  TagListSlice as RawTagListSlice,
  TextAndIconsSlice as RawTextAndIconsSlice,
  TextAndImageSlice as RawTextAndImageSlice,
  TitledTextListSlice as RawTitledTextListSlice,
} from '@weco/common/prismicio-types';
import {
  transformLink,
  transformTaslFromString,
} from '@weco/common/services/prismic/transformers';
import { transformCollectionVenue } from '@weco/common/services/prismic/transformers/collection-venues';
import { transformImage } from '@weco/common/services/prismic/transformers/images';
import {
  isFilledLinkToDocumentWithData,
  isFilledLinkToMediaField,
} from '@weco/common/services/prismic/types';
import { isNotUndefined } from '@weco/common/utils/type-guards';
import { Props as IframeProps } from '@weco/common/views/components/Iframe/Iframe';
import { Props as EmbedProps } from '@weco/common/views/components/VideoEmbed/VideoEmbed';
import { AudioPlayerProps } from '@weco/content/components/AudioPlayer/AudioPlayer';
import { CaptionedImageProps } from '@weco/content/components/CaptionedImage/CaptionedImage';
import { Props as ContactProps } from '@weco/content/components/Contact/Contact';
import { Props as GifVideoProps } from '@weco/content/components/GifVideo/GifVideo';
import { Props as ImageGalleryProps } from '@weco/content/components/ImageGallery';
import { Props as InfoBlockProps } from '@weco/content/components/InfoBlock/InfoBlock';
import { Props as MapProps } from '@weco/content/components/Map/Map';
import { Props as QuoteProps } from '@weco/content/components/Quote/Quote';
import { Props as AsyncSearchResultsProps } from '@weco/content/components/SearchResults/AsyncSearchResults';
import { Props as TagListProps } from '@weco/content/components/TagsGroup/TagsGroup';
import {
  TextAndIconsItem,
  TextAndImageItem,
} from '@weco/content/components/TextAndImageOrIcons';
import { Props as TitledTextListProps } from '@weco/content/components/TitledTextList/TitledTextList';
import { ContentListProps, Slice } from '@weco/content/types/body';

import { asRichText, asText, asTitle } from '.';
import { transformArticle } from './articles';
import { transformCard } from './card';
import {
  getSoundCloudEmbedUrl,
  getVimeoEmbedUrl,
  getYouTubeEmbedUrl,
} from './embeds';
import { transformEventSeries } from './event-series';
import { transformEventBasic } from './events';
import { transformExhibition } from './exhibitions';
import { transformGuide } from './guides';
import { transformCaptionedImage } from './images';
import { transformPage } from './pages';
import { transformSeason } from './seasons';

export function transformStandfirstSlice(
  slice: RawStandfirstSlice
): Slice<'standfirst', prismic.RichTextField> {
  return {
    type: 'standfirst',
    value: slice.primary.text,
  };
}

export function transformTextAndImage(
  slice: RawTextAndImageSlice
): Slice<'textAndImage', TextAndImageItem> {
  return {
    type: 'textAndImage',
    value: {
      type: 'image',
      text: slice.primary.text,
      image: transformImage(slice.primary.image)!,
      isZoomable: slice.primary.isZoomable,
    },
  };
}

export function transformTextAndIcons(
  slice: RawTextAndIconsSlice
): Slice<'textAndIcons', TextAndIconsItem> {
  return {
    type: 'textAndIcons',
    value: {
      type: 'icons',
      text: slice.primary.text,
      icons: slice.items.map(({ icon }) => transformImage(icon)!),
    },
  };
}

export function transformMapSlice(slice: RawMapSlice): Slice<'map', MapProps> {
  return {
    type: 'map',
    value: {
      title: asText(slice.primary.title) || '',
      latitude: slice.primary.geolocation.latitude,
      longitude: slice.primary.geolocation.longitude,
    },
  };
}

function transformTeamToContact(team): ContactProps {
  const {
    data: { title, subtitle, email, phone },
  } = team;

  return {
    title: asTitle(title),
    subtitle: asText(subtitle),
    email,
    phone,
  };
}

export function transformContactSlice(
  slice: RawContactSlice
): Slice<'contact', ContactProps> | undefined {
  return isFilledLinkToDocumentWithData(slice.primary.content)
    ? {
        type: 'contact',
        value: transformTeamToContact(slice.primary.content),
      }
    : undefined;
}

export function transformEditorialImageSlice(
  slice: RawEditorialImageSlice
): Slice<'picture', CaptionedImageProps> {
  return {
    type: 'picture',
    value: transformCaptionedImage(slice.primary),
  };
}

export function transformEditorialImageGallerySlice(
  slice: RawEditorialImageGallerySlice,
  isStandalone?: boolean
): Slice<'imageGallery', ImageGalleryProps> {
  return {
    type: 'imageGallery',
    value: {
      title: asText(slice.primary.title),
      items: slice.items.map(item => transformCaptionedImage(item)),
      isStandalone: isStandalone || false,
      isFrames: slice.primary.isFrames,
    },
  };
}

export function transformGifVideoSlice(
  slice: RawGifVideoSlice
): Slice<'gifVideo', GifVideoProps> | undefined {
  const playbackRate = slice.primary.playbackRate
    ? parseFloat(slice.primary.playbackRate)
    : 1;
  return isFilledLinkToMediaField(slice.primary.video)
    ? {
        type: 'gifVideo',
        value: {
          caption: asRichText(slice.primary.caption),
          videoUrl: slice.primary.video.url,
          playbackRate,
          tasl: transformTaslFromString(slice.primary.tasl),
          autoPlay:
            slice.primary.autoPlay === null ? true : slice.primary.autoPlay, // handle old content before these fields existed
          loop: slice.primary.loop === null ? true : slice.primary.loop,
          mute: slice.primary.mute === null ? true : slice.primary.mute,
          showControls:
            slice.primary.showControls === null
              ? false
              : slice.primary.showControls,
        },
      }
    : undefined;
}

function transformTitledTextItem({
  title,
  text,
  link,
}: {
  title: prismic.RichTextField;
  text: prismic.RichTextField;
  link: prismic.LinkField;
}) {
  return {
    title: asTitle(title),
    text: asRichText(text),
    link: transformLink(link),
  };
}

export function transformTitledTextListSlice(
  slice: RawTitledTextListSlice
): Slice<'titledTextList', TitledTextListProps> {
  return {
    type: 'titledTextList',
    value: {
      items: slice.items.map(item => transformTitledTextItem(item)),
    },
  };
}

export function transformInfoBlockSlice(
  slice: RawInfoBlockSlice
): Slice<'infoBlock', InfoBlockProps> {
  return {
    type: 'infoBlock',
    value: {
      title: asTitle(slice.primary.title),
      text: slice.primary.text,
    },
  };
}

export function transformIframeSlice(
  slice: RawIframeSlice
): Slice<'iframe', IframeProps> {
  return {
    type: 'iframe',
    value: {
      src: slice.primary.iframeSrc!,
      image: transformImage(slice.primary.previewImage)!,
    },
  };
}

export function transformQuoteSlice(
  slice: RawQuoteSlice
): Slice<'quote', QuoteProps> {
  return {
    type: 'quote',
    value: {
      text: slice.primary.text,
      citation: slice.primary.citation,
      isPullOrReview: slice.primary.isPullOrReview,
    },
  };
}

export function transformTagListSlice(
  slice: RawTagListSlice
): Slice<'tagList', TagListProps> {
  return {
    type: 'tagList',
    value: {
      title: asTitle(slice.primary.title),
      tags: slice.items.map(item => ({
        textParts: item.linkText ? [item.linkText] : [],
        linkAttributes: {
          href: { pathname: transformLink(item.link) },
          as: { pathname: transformLink(item.link) },
        },
      })),
    },
  };
}

export function transformAudioPlayerSlice(
  slice: RawAudioPlayerSlice
): Slice<'audioPlayer', AudioPlayerProps> {
  return {
    type: 'audioPlayer',
    value: {
      title: asTitle(slice.primary.title),
      audioFile: transformLink(slice.primary.audio) || '',
      transcript: slice.primary.transcript,
    },
  };
}

export function transformSearchResultsSlice(
  slice: RawSearchResultsSlice
): Slice<'searchResults', AsyncSearchResultsProps> {
  return {
    type: 'searchResults',
    value: {
      title: asText(slice.primary.title),
      query: slice.primary.query || '',
    },
  };
}

export function transformCollectionVenueSlice(
  slice: RawCollectionVenueSlice
):
  | Slice<'collectionVenue', { content: Venue; showClosingTimes: boolean }>
  | undefined {
  return isFilledLinkToDocumentWithData(slice.primary.content)
    ? {
        type: 'collectionVenue',
        value: {
          content: {
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            ...transformCollectionVenue(slice.primary.content as any),
            isFeatured: slice.primary.isFeatured,
          },
          showClosingTimes: slice.primary.showClosingTimes === 'yes',
        },
      }
    : undefined;
}

export function transformEmbedSlice(
  slice: RawEmbedSlice
):
  | Slice<'videoEmbed', EmbedProps>
  | Slice<'soundcloudEmbed', EmbedProps>
  | undefined {
  const embed = slice.primary.embed;

  if (embed.provider_name === 'Vimeo') {
    return {
      type: 'videoEmbed',
      value: {
        embedUrl: getVimeoEmbedUrl(embed),
        videoProvider: 'Vimeo',
        videoThumbnail:
          (embed.thumbnail_url_with_play_button as string) || undefined,
        caption: slice.primary.caption,
        transcript: slice.primary.transcript,
      },
    };
  }

  if (embed.provider_name === 'YouTube') {
    return {
      type: 'videoEmbed',
      value: {
        embedUrl: getYouTubeEmbedUrl(embed),
        videoProvider: 'YouTube',
        caption: slice.primary.caption,
        transcript: slice.primary.transcript,
      },
    };
  }

  if (embed.provider_name === 'SoundCloud') {
    return {
      type: 'soundcloudEmbed',
      value: {
        embedUrl: getSoundCloudEmbedUrl(embed),
        caption: slice.primary.caption,
        transcript: slice.primary.transcript,
      },
    };
  }
}

export function transformContentListSlice(
  slice: RawContentListSlice
): Slice<'contentList', ContentListProps> {
  const contents = slice.items
    .map(item => item.content)
    .filter(isFilledLinkToDocumentWithData);

  return {
    type: 'contentList',
    value: {
      title: asText(slice.primary.title),
      items: contents
        .map(content => {
          switch (content.type) {
            case 'pages':
              return transformPage(content as unknown as RawPagesDocument);
            case 'guides':
              return transformGuide(content as unknown as RawGuidesDocument);
            case 'event-series':
              return transformEventSeries(
                content as unknown as RawEventSeriesDocument
              );
            case 'exhibitions':
              return transformExhibition(
                content as unknown as RawExhibitionsDocument
              );
            case 'articles':
              return transformArticle(
                content as unknown as RawArticlesDocument
              );
            case 'events':
              return transformEventBasic(
                content as unknown as RawEventsDocument
              );
            case 'seasons':
              return transformSeason(content as unknown as RawSeasonsDocument);
            case 'card':
              return transformCard(content as unknown as RawCardDocument);
            default:
              return undefined;
          }
        })
        .filter(isNotUndefined),
    },
  };
}
