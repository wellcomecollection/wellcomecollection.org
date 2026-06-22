export type WorkGroup = {
  heading: string;
  description: string;
  ids: string[];
};

export type KiosksContentType = {
  includedWorks?: string[];
  workGroups?: WorkGroup[];
  exhibitionWorks?: string[];
  featuredWorks?: string[];
  stories?: string[];
  [key: string]: string[] | WorkGroup[] | undefined; // Allow for additional array properties (e.g., Reading Room stories)
};

export const kiosksContent: Record<string, KiosksContentType> = {
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
    workGroups: [
      {
        heading: 'ACT UP',
        description:
          '<p>ACT UP (AIDS Coalition to Unleash Power) is an activist group focused on direct action against the AIDS epidemic. Founded in New York in 1987, it expanded into a global network of independent chapters campaigning around HIV.</p><p>This selection features material from chapters in New York, London, Manchester and Paris.</p>',
        ids: ['d2mxjdkb', 'qbb553nf', 'mfmfu73q'],
      },
      {
        heading: 'What Would an HIV Doula Do?',
        description:
          '<p>Founded in 2015, ‘What Would an HIV Doula Do?’ (WWHIVDD) is a collective of artists, activists and practitioners across the HIV spectrum, formed in response to the ongoing AIDS crisis.</p><p>This selection features digital zines created by WWHIVDD in our collection.</p>',
        ids: ['m8xw26qs', 'bd7tnj3t', 'jnvfvwt4'],
      },
      {
        heading: 'HIV Care Centres in London',
        description:
          '<p>At the height of the UK AIDS epidemic, people living with HIV faced stigma, secrecy and hostile media. Care centres stepped in to provide vital support and safe spaces.</p><p>This selection highlights material from London centres, including The Landmark, The Lighthouse and Mildmay Hospital.</p>',
        ids: ['g7dmnpaj', 'ys83vvw5'],
      },
      {
        heading: 'HIV Posters',
        description:
          '<p>Around the world, organisations, charities and activist groups have used posters to raise awareness of HIV and AIDS. From public health campaigns and support services to protest and advocacy, their design often reflects the communities they are made for.</p><p>Below is a selection of posters from around the world in our collection.</p>',
        ids: ['dh98h9g2', 'y2euzack', 'jtfcxa7t'],
      },
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
