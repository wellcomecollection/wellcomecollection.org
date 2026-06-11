export type KioskContent = {
  includedWorks?: string[];
  relatedWorks?: string[];
  featuredWorks?: string[];
  stories?: string[];
  [key: string]: string[] | undefined; // Allow for additional properties for the Reaading Room stories
};

export const kiosksContent: Record<string, KioskContent> = {
  // Property name should match kioskMode value up to the hyphen, e.g. TR-iPad1 and TR-iPad2 both use TR content
  TR: {
    includedWorks: [
      'eudv2vbg', // AZT on trial
      'zeu8jvyg', // Retrovir packaging (NO IMAGE)
      'jzshasa6', // Landmark poster
      'hg2f7gth', // Wellcome AGM photo (NO IMAGE)
      'p6sw94qt', // 'The Ward' photographs - John
      'unwb3yh8', // 'The Ward' photographs - Ian
      'vc57ua8p', // 'The Ward' photographs - Andre
      'zxyeupbh', // Strutting to Stop Stigma (NO IMAGE)
    ],
    relatedWorks: [
      'r7cfp78k', // ACT UP Poster
      'mfmfu73q', // Boycott Wellcome products
      'y7929gfp', // Act Up-Paris 2009
      'sdyvgkcc', // Act Up-Paris 2009 image
      'v6af8zbh', // Homosexuals: 20,000 live in anger
      'jdjrhh7a', // Pope John Paul II condom ad
      'gn5xtnpa', // Combat AIDS not people with AIDS
      'qbb553nf', // Wellcome Foundation profits soar in '88!
      'y3gun7f2', // Silence = mort
      'bcptfy7m', // 20 ans / Act Up-Paris
    ],
    stories: [
      'artists--activism-and-aids',
      'telling-scotland-about-aids',
      'in-the-tracks-of-derek-jarman-s-tears',
      'guerrilla-public-health',
      'aids-posters',
      'there-at-the-end',
    ],
  },
};
