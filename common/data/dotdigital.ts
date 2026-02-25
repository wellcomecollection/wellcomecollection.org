type AddressBook = {
  id: number;
  slug: string;
  label: string;
  description?: string;
};

export const newsletterAddressBook: AddressBook = {
  id: 40131,
  slug: 'newsletter',
  label: 'Newsletter',
};

export const secondaryAddressBooks: AddressBook[] = [
  {
    id: 43073739,
    slug: 'accessibility',
    label: 'Access events, tours and activities',
  },
  {
    id: 40132,
    slug: 'young_people_14-19',
    label: 'Events and activities for 14 to 19 year-olds',
  },
  {
    id: 40130,
    slug: 'teachers',
    label: 'Events and activities for teachers and schools',
    description:
      'Study days and other events for secondary school teachers and school groups',
  },
  {
    id: 40133,
    slug: 'youth_and_community_workers',
    label: 'Updates for youth and community workers',
  },
];
