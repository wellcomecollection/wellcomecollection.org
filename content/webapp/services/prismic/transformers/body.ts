import {
  CollectionVenueSlice,
  ContactSlice,
  ContentListSlice,
  EditorialImageSlice,
  EditorialImageGallerySlice,
  EmbedSlice,
  IframeSlice,
  InfoBlockSlice,
  MapSlice,
  QuoteSlice,
  SearchResultsSlice,
  StandfirstSlice,
  TagListSlice,
  TitledTextListSlice,
  GifVideoSlice,
  AudioPlayerSlice,
  TextAndImageSlice,
  TextAndIconsSlice,
  PagesDocument,
  ArticlesDocument,
  CardDocument,
  EventsDocument,
  ExhibitionsDocument,
  GuidesDocument,
  EventSeriesDocument,
  SeasonsDocument,
} from '@weco/common/prismicio-types';
import { isNotUndefined } from '@weco/common/utils/type-guards';
import {
  isFilledLinkToDocumentWithData,
  isFilledLinkToMediaField,
} from '@weco/common/services/prismic/types';
import { transformCaptionedImage } from './images';
import { transformImage } from '@weco/common/services/prismic/transformers/images';
import { asRichText, asTitle, asText } from '.';
import {
  transformLink,
  transformTaslFromString,
} from '@weco/common/services/prismic/transformers';
import * as prismic from '@prismicio/client';
import { ContentListProps, Slice, Weight } from '@weco/content/types/body';
import { transformCollectionVenue } from '@weco/common/services/prismic/transformers/collection-venues';
import { transformPage } from './pages';
import { transformGuide } from './guides';
import { transformEventSeries } from './event-series';
import { transformExhibition } from './exhibitions';
import { transformArticle } from './articles';
import { transformEventBasic } from './events';
import { transformSeason } from './seasons';
import { transformCard } from './card';
import {
  getSoundCloudEmbedUrl,
  getVimeoEmbedUrl,
  getYouTubeEmbedUrl,
} from './embeds';
import { AudioPlayerProps } from '@weco/content/components/AudioPlayer/AudioPlayer';
import { Props as QuoteProps } from '@weco/content/components/Quote/Quote';
import { CaptionedImageProps } from '@weco/content/components/CaptionedImage/CaptionedImage';
import { Props as ImageGalleryProps } from '@weco/content/components/ImageGallery';
import { Props as ContactProps } from '@weco/content/components/Contact/Contact';
import { Props as MapProps } from '@weco/content/components/Map/Map';
import { Props as GifVideoProps } from '@weco/content/components/GifVideo/GifVideo';
import { Props as InfoBlockProps } from '@weco/content/components/InfoBlock/InfoBlock';
import { Props as IframeProps } from '@weco/common/views/components/Iframe/Iframe';
import { Props as TagListProps } from '@weco/content/components/TagsGroup/TagsGroup';
import { Props as EmbedProps } from '@weco/common/views/components/VideoEmbed/VideoEmbed';
import {
  TextAndImageItem,
  TextAndIconsItem,
} from '@weco/content/components/TextAndImageOrIcons';
import { Props as TitledTextListProps } from '@weco/content/components/TitledTextList/TitledTextList';
import { Props as AsyncSearchResultsProps } from '@weco/content/components/SearchResults/AsyncSearchResults';
import { Venue } from '@weco/common/model/opening-hours';

// TODO all the TODOs in this file
export function getWeight(weight: string | null): Weight {
  switch (weight) {
    case 'featured':
      return weight;
    case 'standalone':
      return weight;
    case 'supporting':
      return weight;
    case 'frames':
      return weight;
    default:
      return 'default';
  }
}

export function transformStandfirstSlice(
  slice: StandfirstSlice
): Slice<'standfirst', prismic.RichTextField> {
  return {
    type: 'standfirst',
    weight: getWeight(slice.slice_label),
    value: slice.primary.text,
  };
}

export function transformTextAndImage(
  slice: TextAndImageSlice
): Slice<'textAndImage', TextAndImageItem> {
  return {
    type: 'textAndImage',
    value: {
      type: 'image',
      text: slice.primary.text,
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      image: transformImage(slice.primary.image)!,
      isZoomable: slice.primary.isZoomable,
    },
  };
}

export function transformTextAndIcons(
  slice: TextAndIconsSlice
): Slice<'textAndIcons', TextAndIconsItem> {
  return {
    type: 'textAndIcons',
    value: {
      type: 'icons',
      text: slice.primary.text,
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      icons: slice.items.map(({ icon }) => transformImage(icon)!),
    },
  };
}

export function transformMapSlice(slice: MapSlice): Slice<'map', MapProps> {
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
    subtitle: asText(subtitle) || null,
    email,
    phone,
  };
}

export function transformContactSlice(
  slice: ContactSlice
): Slice<'contact', ContactProps> | undefined {
  return isFilledLinkToDocumentWithData(slice.primary.content)
    ? {
        type: 'contact',
        value: transformTeamToContact(slice.primary.content),
      }
    : undefined;
}

export function transformEditorialImageSlice(
  slice: EditorialImageSlice
): Slice<'picture', CaptionedImageProps> {
  return {
    weight: getWeight(slice.slice_label),
    type: 'picture',
    value: transformCaptionedImage(slice.primary),
  };
}

export function transformEditorialImageGallerySlice(
  slice: EditorialImageGallerySlice,
  isStandalone?: boolean
): Slice<'imageGallery', ImageGalleryProps> {
  return {
    type: 'imageGallery',
    value: {
      title: asText(slice.primary.title),
      items: slice.items.map(item => transformCaptionedImage(item)),
      isStandalone:
        isStandalone || getWeight(slice.slice_label) === 'standalone', // TODO: remove the getWeight() part when migration's complete
      isFrames:
        slice.primary.isFrames || getWeight(slice.slice_label) === 'frames',
    },
  };
}

export function transformGifVideoSlice(
  slice: GifVideoSlice
): Slice<'gifVideo', GifVideoProps> | undefined {
  const playbackRate = slice.primary.playbackRate
    ? parseFloat(slice.primary.playbackRate)
    : 1;
  return isFilledLinkToMediaField(slice.primary.video)
    ? {
        type: 'gifVideo',
        weight: getWeight(slice.slice_label),
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
  slice: TitledTextListSlice
): Slice<'titledTextList', TitledTextListProps> {
  return {
    type: 'titledTextList',
    value: {
      items: slice.items.map(item => transformTitledTextItem(item)),
    },
  };
}

export function transformInfoBlockSlice(
  slice: InfoBlockSlice
): Slice<'infoBlock', InfoBlockProps> {
  return {
    type: 'infoBlock',
    value: {
      title: asTitle(slice.primary.title),
      text: slice.primary.text,
      linkText: slice.primary.linkText,
      link:
        'url' in slice.primary.link
          ? transformLink(slice.primary.link)
          : undefined,
    },
  };
}

export function transformIframeSlice(
  slice: IframeSlice
): Slice<'iframe', IframeProps> {
  return {
    type: 'iframe',
    weight: getWeight(slice.slice_label),
    value: {
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      src: slice.primary.iframeSrc!,
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      image: transformImage(slice.primary.previewImage)!,
    },
  };
}

export function transformQuoteSlice(
  slice: QuoteSlice
): Slice<'quote', QuoteProps> {
  return {
    type: 'quote',
    weight: getWeight(slice.slice_label),
    value: {
      text: slice.primary.text,
      citation: slice.primary.citation,
      isPullOrReview:
        slice.primary.isPullOrReview ||
        slice.slice_label === 'pull' ||
        slice.slice_label === 'review', // TODO: tidy after migration
    },
  };
}

export function transformTagListSlice(
  slice: TagListSlice
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
  slice: AudioPlayerSlice
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
  slice: SearchResultsSlice
): Slice<'searchResults', AsyncSearchResultsProps> {
  return {
    type: 'searchResults',
    weight: getWeight(slice.slice_label),
    value: {
      title: asText(slice.primary.title),
      query: slice.primary.query || '',
    },
  };
}

export function transformCollectionVenueSlice(
  slice: CollectionVenueSlice
):
  | Slice<'collectionVenue', { content: Venue; showClosingTimes: boolean }>
  | undefined {
  return isFilledLinkToDocumentWithData(slice.primary.content)
    ? {
        type: 'collectionVenue',
        weight: getWeight(slice.slice_label),
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
  slice: EmbedSlice
):
  | Slice<'videoEmbed', EmbedProps>
  | Slice<'soundcloudEmbed', EmbedProps>
  | undefined {
  const embed = slice.primary.embed;

  if (embed.provider_name === 'Vimeo') {
    return {
      type: 'videoEmbed',
      weight: getWeight(slice.slice_label),
      value: {
        embedUrl: getVimeoEmbedUrl(embed),
        caption: slice.primary.caption,
        transcript: slice.primary.transcript,
      },
    };
  }

  if (embed.provider_name === 'SoundCloud') {
    return {
      type: 'soundcloudEmbed',
      weight: getWeight(slice.slice_label),
      value: {
        embedUrl: getSoundCloudEmbedUrl(embed),
        caption: slice.primary.caption,
        transcript: slice.primary.transcript,
      },
    };
  }

  if (embed.provider_name === 'YouTube') {
    return {
      type: 'videoEmbed',
      weight: getWeight(slice.slice_label),
      value: {
        embedUrl: getYouTubeEmbedUrl(embed),
        caption: slice.primary.caption,
        transcript: slice.primary.transcript,
      },
    };
  }
}

export function transformContentListSlice(
  slice: ContentListSlice
): Slice<'contentList', ContentListProps> {
  const contents = slice.items
    .map(item => item.content)
    .filter(isFilledLinkToDocumentWithData);

  return {
    type: 'contentList',
    weight: getWeight(slice.slice_label),
    value: {
      title: asText(slice.primary.title),
      // TODO: The old code would look up a `hasFeatured` field on `slice.primary`,
      // but that doesn't exist in our Prismic model.
      // hasFeatured: slice.primary.hasFeatured,
      // TODO should other types be added? For example, books are allowed in Content Lists
      items: contents
        .map(content => {
          switch (content.type) {
            case 'pages':
              return transformPage(content as unknown as PagesDocument);
            case 'guides':
              return transformGuide(content as unknown as GuidesDocument);
            case 'event-series':
              return transformEventSeries(
                content as unknown as EventSeriesDocument
              );
            case 'exhibitions':
              return transformExhibition(
                content as unknown as ExhibitionsDocument
              );
            case 'articles':
              return transformArticle(content as unknown as ArticlesDocument);
            case 'events':
              return transformEventBasic(content as unknown as EventsDocument);
            case 'seasons':
              return transformSeason(content as unknown as SeasonsDocument);
            case 'card':
              return transformCard(content as unknown as CardDocument);
            default:
              return undefined;
          }
        })
        .filter(isNotUndefined),
    },
  };
}
