export type ContentAPILinkedWork = {
  id: string;
  title: string;
  type: 'Work';
  thumbnailUrl: string;
  date: string;
  mainContributor: string;
  workType: string;
  isOnline: string;
};

export const mockArticle: {
  type: string;
  id: string;
  uid: string;
  title: string;
  linkedWorks: ContentAPILinkedWork[];
} = {
  type: 'Article',
  id: 'Z-FyfxEAACIAwNl_',
  uid: 'waking-the-dead',
  title: 'Waking the dead',
  linkedWorks: [
    {
      id: 'a2239muq',
      title:
        'Ueber den Krebs der Nasenhöhle ... / vorgelegt von Hermann Wolter.',
      type: 'Work',
      thumbnailUrl:
        'https://iiif.wellcomecollection.org/thumbs/b30598977_0001.jp2/full/!200,200/0/default.jpg',
      date: '1900',
      mainContributor: 'Wolter, Hermann (Wilhelm Victor Hermann), 1868-',
      workType: 'Books',
      isOnline: 'true',
    },
    {
      id: 'a2239muq',
      title:
        'Ueber den Krebs der Nasenhöhle ... / vorgelegt von Hermann Wolter.',
      type: 'Work',
      thumbnailUrl:
        'https://iiif.wellcomecollection.org/thumbs/b30598977_0001.jp2/full/!200,200/0/default.jpg',
      date: '1900',
      mainContributor: 'Wolter, Hermann (Wilhelm Victor Hermann), 1868-',
      workType: 'Books',
      isOnline: 'true',
    },
    {
      id: 'a2239muq',
      title:
        'Ueber den Krebs der Nasenhöhle ... / vorgelegt von Hermann Wolter.',
      type: 'Work',
      thumbnailUrl:
        'https://iiif.wellcomecollection.org/thumbs/b30598977_0001.jp2/full/!200,200/0/default.jpg',
      date: '1900',
      mainContributor: 'Wolter, Hermann (Wilhelm Victor Hermann), 1868-',
      workType: 'Books',
      isOnline: 'true',
    },
    {
      id: 'a2239muq',
      title:
        'Ueber den Krebs der Nasenhöhle ... / vorgelegt von Hermann Wolter.',
      type: 'Work',
      thumbnailUrl:
        'https://iiif.wellcomecollection.org/thumbs/b30598977_0001.jp2/full/!200,200/0/default.jpg',
      date: '1900',
      mainContributor: 'Wolter, Hermann (Wilhelm Victor Hermann), 1868-',
      workType: 'Books',
      isOnline: 'true',
    },
  ],
};
