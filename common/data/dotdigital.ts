type AddressBook = {
  id: number;
  slug: string;
  label: string;
  description?: string;
};

export const newsletterAddressBook: AddressBook = {
  id: 40131,
  slug: 'newsletter',
  label:
    'What’s On newsletter: Be one of the first to hear about what’s happening onsite and online at Wellcome Collection.',
};

export const secondaryAddressBooks: AddressBook[] = [
  {
    id: 43073739,
    slug: 'accessibility',
    label:
      'Access newsletter: Stay up to date about accessible tours, events and activities with our access newsletter.',
  },
  {
    id: 39507938,
    slug: 'young_people_14-19',
    label:
      'Youth newsletter: Are you aged 14-19 years old? Get updates for free events and workshops where you can meet other young creatives and experts.',
  },
  {
    id: 40130,
    slug: 'teachers',
    label:
      'Teachers newsletter: Are you a teacher? Learn about free relevant events and workshops for your students.',
    description:
      'Study days and other events for secondary school teachers and school groups',
  },
];
