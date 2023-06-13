import { constructHierarchy } from '@weco/content/services/prismic/transformers/pages';

const links = [
  {
    level: 2,
    text: 'Introduction to Wellcome Collection',
    url: '#introduction-to-wellcome-collection',
  },
  {
    level: 3,
    text: 'Quieter times to visit',
    url: '#quieter-times-to-visit',
  },
  {
    level: 2,
    text: 'Getting to Wellcome Collection',
    url: '#getting-to-wellcome-collection',
  },
  {
    level: 3,
    text: 'Arriving by tube or train',
    url: '#arriving-by-tube-or-train',
  },
  { level: 3, text: 'Arriving by bus', url: '#arriving-by-bus' },
  { level: 3, text: 'Arriving by bike', url: '#arriving-by-bike' },
  {
    level: 3,
    text: 'Arriving by car',
    url: '#arriving-by-car',
  },
  { level: 2, text: 'Access when you arrive', url: '#access-when-you-arrive' },
  {
    level: 3,
    text: 'Gallery access provisions',
    url: '#gallery-access-provisions',
  },
];

export const anchorLinks = constructHierarchy(links, 3);
