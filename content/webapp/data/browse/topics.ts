export type Collaborator = {
  id: string;
  label: string;
  conceptId: string;
};

export type SubTopic = {
  id: string;
  label: string;
  workCount: number;
  conceptId?: string;
  collaborators: Collaborator[];
};

export type BrowseTopic = {
  id: string;
  label: string;
  description: {
    text: string;
  };
  slug: string;
  imageUrl?: string;
  conceptId: string;
  subTopics: SubTopic[];
};

// export const topics: BrowseTopic[] = [
//   {
//     id: 'public-health',
//     label: 'Public health',
//     description:
//       'Explore works on public health, disease prevention, and community wellbeing.',
//     slug: 'public-health',
//     conceptId: 'ph1a2b3c',
//     subTopics: [
//       {
//         id: 'sanitation',
//         label: 'Sanitation',
//         workCount: 1850,
//         conceptId: 'sanitation-concept',
//         collaborators: [
//           { id: 'p1', label: 'John Snow', conceptId: 'c-john-snow' },
//           {
//             id: 'p2',
//             label: 'Florence Nightingale',
//             conceptId: 'c-nightingale',
//           },
//           { id: 'p3', label: 'Edwin Chadwick', conceptId: 'c-chadwick' },
//         ],
//       },
//       {
//         id: 'disease-outbreaks',
//         label: 'Diseases and outbreaks',
//         workCount: 2400,
//         conceptId: 'disease-outbreaks-concept',
//         collaborators: [
//           { id: 'p4', label: 'Edward Jenner', conceptId: 'c-jenner' },
//           { id: 'p5', label: 'Louis Pasteur', conceptId: 'c-pasteur' },
//           { id: 'p6', label: 'Robert Koch', conceptId: 'c-koch' },
//         ],
//       },
//       {
//         id: 'epidemiology',
//         label: 'Epidemiology',
//         workCount: 1650,
//         conceptId: 'epidemiology-concept',
//         collaborators: [
//           { id: 'p7', label: 'William Farr', conceptId: 'c-farr' },
//           { id: 'p8', label: 'Janet Lane-Claypon', conceptId: 'c-claypon' },
//           { id: 'p9', label: 'Austin Bradford Hill', conceptId: 'c-hill' },
//         ],
//       },
//     ],
//   },
//   {
//     id: 'genetics',
//     label: 'Genetics',
//     description: 'Discover materials on heredity, genes, and genetic research.',
//     slug: 'genetics',
//     conceptId: 'g4d5e6f',
//     subTopics: [
//       {
//         id: 'mendelian-genetics',
//         label: 'Mendelian genetics',
//         workCount: 980,
//         collaborators: [
//           { id: 'p10', label: 'Gregor Mendel', conceptId: 'c-mendel' },
//           { id: 'p11', label: 'William Bateson', conceptId: 'c-bateson' },
//           {
//             id: 'p12',
//             label: 'Thomas Hunt Morgan',
//             conceptId: 'c-morgan',
//           },
//         ],
//       },
//       {
//         id: 'molecular-genetics',
//         label: 'Molecular genetics',
//         workCount: 1250,
//         collaborators: [
//           { id: 'p13', label: 'Rosalind Franklin', conceptId: 'c-franklin' },
//           {
//             id: 'p14',
//             label: 'Francis Crick',
//             conceptId: 'c-crick',
//           },
//           { id: 'p15', label: 'James Watson', conceptId: 'c-watson' },
//         ],
//       },
//       {
//         id: 'eugenics',
//         label: 'Eugenics',
//         workCount: 1420,
//         collaborators: [
//           { id: 'p16', label: 'Francis Galton', conceptId: 'c-galton' },
//           { id: 'p17', label: 'Karl Pearson', conceptId: 'c-pearson' },
//           { id: 'p18', label: 'Marie Stopes', conceptId: 'c-stopes' },
//         ],
//       },
//     ],
//   },
//   {
//     id: 'sex',
//     label: 'Sex',
//     description:
//       'Browse materials on sexuality, sexual health, and sexual identity.',
//     slug: 'sex',
//     conceptId: 's7h8i9j',
//     subTopics: [
//       {
//         id: 'sex-education',
//         label: 'Sex education',
//         workCount: 890,
//         collaborators: [
//           { id: 'p19', label: 'Havelock Ellis', conceptId: 'c-ellis' },
//           {
//             id: 'p20',
//             label: 'Margaret Sanger',
//             conceptId: 'c-sanger',
//           },
//           { id: 'p21', label: 'Alex Comfort', conceptId: 'c-comfort' },
//         ],
//       },
//       {
//         id: 'sexual-identity',
//         label: 'Sexual identity',
//         workCount: 670,
//         collaborators: [
//           { id: 'p22', label: 'Magnus Hirschfeld', conceptId: 'c-hirschfeld' },
//           { id: 'p23', label: 'Alfred Kinsey', conceptId: 'c-kinsey' },
//           {
//             id: 'p24',
//             label: 'Evelyn Hooker',
//             conceptId: 'c-hooker',
//           },
//         ],
//       },
//     ],
//   },
//   {
//     id: 'history-of-medicine',
//     label: 'History of medicine',
//     description:
//       'Explore the development of medical knowledge and practice through the ages.',
//     slug: 'history-of-medicine',
//     conceptId: 'h1m2n3o',
//     subTopics: [
//       {
//         id: 'ancient-medicine',
//         label: 'Ancient medicine',
//         workCount: 1150,
//         collaborators: [
//           { id: 'p25', label: 'Hippocrates', conceptId: 'c-hippocrates' },
//           { id: 'p26', label: 'Galen', conceptId: 'c-galen' },
//           { id: 'p27', label: 'Avicenna', conceptId: 'c-avicenna' },
//         ],
//       },
//       {
//         id: 'surgery',
//         label: 'Surgery',
//         workCount: 2100,
//         collaborators: [
//           { id: 'p28', label: 'Joseph Lister', conceptId: 'c-lister' },
//           { id: 'p29', label: 'Alexis Carrel', conceptId: 'c-carrel' },
//           {
//             id: 'p30',
//             label: 'Christiaan Barnard',
//             conceptId: 'c-barnard',
//           },
//         ],
//       },
//       {
//         id: 'pharmacy',
//         label: 'Pharmacy',
//         workCount: 1680,
//         collaborators: [
//           { id: 'p31', label: 'Paracelsus', conceptId: 'c-paracelsus' },
//           {
//             id: 'p32',
//             label: 'William Withering',
//             conceptId: 'c-withering',
//           },
//           { id: 'p33', label: 'Gertrude Elion', conceptId: 'c-elion' },
//         ],
//       },
//     ],
//   },
//   {
//     id: 'sexual-health',
//     label: 'Sexual health',
//     description:
//       'Access materials on sexually transmitted infections, reproductive health, and family planning.',
//     slug: 'sexual-health',
//     conceptId: 'sh4p5q6',
//     subTopics: [
//       {
//         id: 'contraception',
//         label: 'Contraception',
//         workCount: 1240,
//         collaborators: [
//           { id: 'p34', label: 'Marie Stopes', conceptId: 'c-stopes-2' },
//           {
//             id: 'p35',
//             label: 'Gregory Pincus',
//             conceptId: 'c-pincus',
//           },
//           { id: 'p36', label: 'John Rock', conceptId: 'c-rock' },
//         ],
//       },
//       {
//         id: 'sti',
//         label: 'Sexually transmitted infections',
//         workCount: 980,
//         collaborators: [
//           { id: 'p37', label: 'Philippe Ricord', conceptId: 'c-ricord' },
//           {
//             id: 'p38',
//             label: 'August von Wassermann',
//             conceptId: 'c-wassermann',
//           },
//           { id: 'p39', label: 'Alexander Fleming', conceptId: 'c-fleming' },
//         ],
//       },
//     ],
//   },
//   {
//     id: 'mental-health',
//     label: 'Mental health',
//     description:
//       'Examine works on mental illness, psychiatry, and psychological wellbeing.',
//     slug: 'mental-health',
//     conceptId: 'mh7r8s9',
//     subTopics: [
//       {
//         id: 'psychiatry',
//         label: 'Psychiatry',
//         workCount: 1950,
//         collaborators: [
//           { id: 'p40', label: 'Sigmund Freud', conceptId: 'c-freud' },
//           { id: 'p41', label: 'Carl Jung', conceptId: 'c-jung' },
//           {
//             id: 'p42',
//             label: 'Anna Freud',
//             conceptId: 'c-anna-freud',
//           },
//         ],
//       },
//       {
//         id: 'asylum-care',
//         label: 'Asylum care',
//         workCount: 1380,
//         collaborators: [
//           { id: 'p43', label: 'Philippe Pinel', conceptId: 'c-pinel' },
//           { id: 'p44', label: 'Dorothea Dix', conceptId: 'c-dix' },
//           {
//             id: 'p45',
//             label: 'William Tuke',
//             conceptId: 'c-tuke',
//           },
//         ],
//       },
//     ],
//   },
//   {
//     id: 'anatomy',
//     label: 'Anatomy',
//     description:
//       'Study the structure of the human body through anatomical texts and illustrations.',
//     slug: 'anatomy',
//     conceptId: 'an1t2u3',
//     subTopics: [
//       {
//         id: 'dissection',
//         label: 'Dissection',
//         workCount: 1120,
//         collaborators: [
//           { id: 'p46', label: 'Andreas Vesalius', conceptId: 'c-vesalius' },
//           {
//             id: 'p47',
//             label: 'William Hunter',
//             conceptId: 'c-hunter',
//           },
//           { id: 'p48', label: 'Henry Gray', conceptId: 'c-gray' },
//         ],
//       },
//       {
//         id: 'anatomical-illustration',
//         label: 'Anatomical illustration',
//         workCount: 2050,
//         collaborators: [
//           {
//             id: 'p49',
//             label: 'Leonardo da Vinci',
//             conceptId: 'c-leonardo',
//           },
//           { id: 'p50', label: 'Jan van Calcar', conceptId: 'c-calcar' },
//           {
//             id: 'p51',
//             label: 'Max Brödel',
//             conceptId: 'c-brodel',
//           },
//         ],
//       },
//     ],
//   },
//   {
//     id: 'diseases',
//     label: 'Diseases',
//     description:
//       'Investigate the causes, symptoms, and treatments of various diseases.',
//     slug: 'diseases',
//     conceptId: 'di4v5w6',
//     subTopics: [
//       {
//         id: 'infectious-diseases',
//         label: 'Infectious diseases',
//         workCount: 2850,
//         collaborators: [
//           { id: 'p52', label: 'Robert Koch', conceptId: 'c-koch-2' },
//           { id: 'p53', label: 'Louis Pasteur', conceptId: 'c-pasteur-2' },
//           {
//             id: 'p54',
//             label: 'Ronald Ross',
//             conceptId: 'c-ross',
//           },
//         ],
//       },
//       {
//         id: 'chronic-diseases',
//         label: 'Chronic diseases',
//         workCount: 1760,
//         collaborators: [
//           {
//             id: 'p55',
//             label: 'Frederick Banting',
//             conceptId: 'c-banting',
//           },
//           {
//             id: 'p56',
//             label: 'William Osler',
//             conceptId: 'c-osler',
//           },
//           { id: 'p57', label: 'Thomas Addison', conceptId: 'c-addison' },
//         ],
//       },
//     ],
//   },
// ];

export const randomTopicPool = [
  'Traditional Chinese medicine',
  'Alchemy',
  'Herbalism',
  'Midwifery',
  'Nursing',
  'Medical astrology',
  'Phrenology',
  'Mesmerism',
  'Homeopathy',
  'Tropical medicine',
  'Military medicine',
  'Veterinary medicine',
  'Dentistry',
  'Ophthalmology',
  'Paediatrics',
];
