export type BrowseType = {
  id: string;
  label: string;
  description: string;
  slug: string;
  imageUrl?: string;
  workCount: number;
  size: 'large' | 'medium' | 'small';
  conceptId?: string;
  subTypes: SubType[];
};

export type SubType = {
  id: string;
  label: string;
  workCount: number;
};

export const types: BrowseType[] = [
  {
    id: 'books',
    label: 'Books',
    description:
      'Explore our collection of printed books, rare volumes, and e-books covering medical history, science, and health.',
    slug: 'books',
    workCount: 50000,
    size: 'large',
    conceptId: 'zwvck64v',
    subTypes: [
      { id: 'biographies', label: 'Biographies', workCount: 1200 },
      { id: 'zines', label: 'Zines', workCount: 350 },
      { id: 'academic', label: 'Academic texts', workCount: 8500 },
      { id: 'fiction', label: 'Fiction', workCount: 2100 },
      { id: 'reference', label: 'Reference works', workCount: 3400 },
    ],
  },
  {
    id: 'archives',
    label: 'Archives & manuscripts',
    description:
      'Discover unique archival collections and manuscript materials documenting the history of medicine and healthcare.',
    slug: 'archives',
    workCount: 45000,
    size: 'large',
    conceptId: 'x7j5k8m2',
    subTypes: [
      { id: 'personal-papers', label: 'Personal papers', workCount: 4500 },
      {
        id: 'organisational-archives',
        label: 'Organisational archives',
        workCount: 3200,
      },
      { id: 'correspondence', label: 'Correspondence', workCount: 5600 },
      { id: 'diaries', label: 'Diaries', workCount: 890 },
      { id: 'notebooks', label: 'Notebooks', workCount: 1100 },
    ],
  },
  {
    id: 'pictures',
    label: 'Pictures',
    description:
      'Browse our extensive collection of photographs, prints, drawings, and paintings.',
    slug: 'pictures',
    workCount: 35000,
    size: 'medium',
    conceptId: 'p9q2r5t8',
    subTypes: [
      { id: 'photographs', label: 'Photographs', workCount: 12000 },
      { id: 'prints', label: 'Prints', workCount: 8500 },
      { id: 'drawings', label: 'Drawings', workCount: 6200 },
      { id: 'paintings', label: 'Paintings', workCount: 2800 },
      { id: 'engravings', label: 'Engravings', workCount: 4100 },
    ],
  },
  {
    id: 'ephemera',
    label: 'Ephemera',
    description:
      'Explore pamphlets, leaflets, posters, and other printed materials not intended to be kept.',
    slug: 'ephemera',
    workCount: 28000,
    size: 'medium',
    conceptId: 'e4f7g9h1',
    subTypes: [
      { id: 'posters', label: 'Posters', workCount: 4500 },
      { id: 'pamphlets', label: 'Pamphlets', workCount: 8900 },
      { id: 'leaflets', label: 'Leaflets', workCount: 6200 },
      { id: 'programmes', label: 'Programmes', workCount: 1800 },
      { id: 'advertisements', label: 'Advertisements', workCount: 3400 },
    ],
  },
  {
    id: 'journals',
    label: 'Journals',
    description:
      'Access medical and scientific journals, periodicals, and serial publications.',
    slug: 'journals',
    workCount: 25000,
    size: 'medium',
    conceptId: 'j3k6l9m2',
    subTypes: [
      { id: 'medical-journals', label: 'Medical journals', workCount: 8500 },
      {
        id: 'scientific-journals',
        label: 'Scientific journals',
        workCount: 6200,
      },
      {
        id: 'society-publications',
        label: 'Society publications',
        workCount: 3800,
      },
      { id: 'newsletters', label: 'Newsletters', workCount: 2900 },
      { id: 'proceedings', label: 'Proceedings', workCount: 2100 },
    ],
  },
  {
    id: 'born-digital',
    label: 'Born-digital archives',
    description:
      'Discover materials created in digital format, including websites, databases, and digital records.',
    slug: 'born-digital',
    workCount: 8500,
    size: 'small',
    conceptId: 'b5c8d1e4',
    subTypes: [
      { id: 'websites', label: 'Websites', workCount: 450 },
      { id: 'databases', label: 'Databases', workCount: 380 },
      { id: 'digital-records', label: 'Digital records', workCount: 2100 },
      { id: 'email-archives', label: 'Email archives', workCount: 890 },
    ],
  },
  {
    id: 'audio',
    label: 'Audio',
    description:
      'Listen to oral histories, lectures, interviews, and sound recordings.',
    slug: 'audio',
    workCount: 7200,
    size: 'small',
    conceptId: 'a7b9c2d5',
    subTypes: [
      { id: 'oral-histories', label: 'Oral histories', workCount: 1800 },
      { id: 'lectures', label: 'Lectures', workCount: 2100 },
      { id: 'interviews', label: 'Interviews', workCount: 1600 },
      { id: 'recordings', label: 'Sound recordings', workCount: 1200 },
    ],
  },
  {
    id: 'film',
    label: 'Film',
    description:
      'Watch medical films, documentaries, and moving image materials.',
    slug: 'film',
    workCount: 6800,
    size: 'small',
    conceptId: 'f1g4h7j9',
    subTypes: [
      { id: 'documentaries', label: 'Documentaries', workCount: 1200 },
      { id: 'educational-films', label: 'Educational films', workCount: 2400 },
      { id: 'newsreels', label: 'Newsreels', workCount: 890 },
      { id: 'animations', label: 'Animations', workCount: 650 },
    ],
  },
  {
    id: 'dissertations',
    label: 'Student dissertations',
    description:
      'Read student dissertations and theses on medical and health-related topics.',
    slug: 'dissertations',
    workCount: 5400,
    size: 'small',
    conceptId: 'd2e5f8g1',
    subTypes: [
      { id: 'phd-theses', label: 'PhD theses', workCount: 2100 },
      { id: 'masters-theses', label: "Master's theses", workCount: 1800 },
      {
        id: 'undergraduate-dissertations',
        label: 'Undergraduate dissertations',
        workCount: 1200,
      },
    ],
  },
  {
    id: '3d-objects',
    label: '3-D objects',
    description:
      'Explore medical instruments, anatomical models, and three-dimensional objects.',
    slug: '3d-objects',
    workCount: 4200,
    size: 'small',
    conceptId: 't3d6h9j2',
    subTypes: [
      {
        id: 'medical-instruments',
        label: 'Medical instruments',
        workCount: 1600,
      },
      { id: 'anatomical-models', label: 'Anatomical models', workCount: 980 },
      { id: 'equipment', label: 'Equipment', workCount: 780 },
      { id: 'specimens', label: 'Specimens', workCount: 520 },
    ],
  },
];
