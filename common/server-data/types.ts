import {
  PrismicData,
  defaultValue as prismicDefaultValue,
  SimplifiedPrismicData,
} from '@weco/common/server-data/prismic';
import { Toggles } from '@weco/toggles';

/**
 * The type is stored here rather than with the service because
 * the service can only be included when running server-side
 * but the types are needed isomorphically
 */
export type ServerData = {
  toggles: Toggles;
  prismic: PrismicData;
  consentStatus: ConsentStatusProps;
  exhibitionExtras: Record<string, GalleryExhibitionData>;
};

export type SimplifiedServerData = {
  toggles: Toggles;
  prismic: SimplifiedPrismicData;
  consentStatus: ConsentStatusProps;
  exhibitionExtras: Record<string, GalleryExhibitionData>;
};

export type ConsentStatusProps = {
  analytics: boolean;
  marketing: boolean;
  cookieExists: boolean;
};

export type GalleryExhibitionData = {
  title: string;
  url: string;
  works: string[];
  collectionClusters: { title: string; url: string }[];
  stories: string[];
};

export type GalleryData = {
  exhibitions: Record<string, GalleryExhibitionData>;
};

export const defaultExhibitionExtras: Record<string, GalleryExhibitionData> = {
  'tenderness-and-rage': {
    title: 'Tenderness and Rage',
    url: '/exhibitions/tenderness-and-rage',
    works: [
      'eudv2vbg', // AZT on trial
      'zeu8jvyg', // Retrovir packaging (NO IMAGE)
      'hg2f7gth', // Wellcome AGM photo (NO IMAGE)
      'jzshasa6', // Landmark poster
      'p6sw94qt', // 'The Ward' photographs - John
      'unwb3yh8', // 'The Ward' photographs - Ian
      'vc57ua8p', // 'The Ward' photographs - Andre
      'zxyeupbh', // Strutting to Stop Stigma (NO IMAGE)
    ],
    collectionClusters: [
      {
        title: 'What Would An HIV Doula Do (WWHIVDD), digital zines',
        url: '/search/works?query=WWHIVDD',
      },
      {
        title: 'HIV infections – Prevention',
        url: '/concepts/jk93pkmw',
      },
      {
        title: 'HIV Africa material',
        url: '/search/images?query=HIV+africa',
      },
      {
        title: 'Jordan Eagles, Blood Mirror',
        url: '/search/works?query=Jordan+Eagles',
      },
      { title: 'ACT UP online material', url: '/concepts/kgrkehja' },
      { title: 'World AIDS Day', url: '/concepts/z9pu3ktm' },
      { title: 'Community centers', url: '/concepts/g2zph654' },
      { title: 'HIV Seropositivity', url: '/concepts/j8ccram4' },
      { title: 'The Ward Revisited (Film)', url: '/works/gr36peg6' },
    ],
    stories: [
      'telling-scotland-about-aids',
      'in-the-tracks-of-derek-jarman-s-tears',
      'guerrilla-public-health',
      'artists--activism-and-aids',
      'aids-posters',
      'what-are-zines-doing-in-a-museum',
      'how-to-design-an-hiv-awareness-campaign',
    ],
  },
};

export const defaultServerData: SimplifiedServerData = {
  toggles: {},
  prismic: prismicDefaultValue,
  consentStatus: {
    analytics: false,
    marketing: false,
    cookieExists: false,
  },
  exhibitionExtras: defaultExhibitionExtras,
};

/**
 * This is a weird check but checks that whatever object you have
 * has the right keys
 */
export function isServerData(obj: unknown): obj is ServerData {
  if (!obj) return false;

  return (
    typeof obj === 'object' &&
    obj !== null &&
    Object.keys(obj).sort().toString() ===
      Object.keys(defaultServerData).sort().toString()
  );
}
