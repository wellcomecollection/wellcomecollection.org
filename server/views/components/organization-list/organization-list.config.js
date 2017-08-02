import type {Organization} from '../../../model/organization';

const orgOne = ({
  name: 'Org name',
  url: 'Smithsonian Institution',
  logo: 'https://placeholdit.co/i/200x200?text=Smithsonian%20Institution'
} : Organization);

const orgTwo = ({
  name: 'Natural History Museum',
  url: '#',
  logo: 'https://placeholdit.co/i/200x200?text=Natural%20History%20Museum&bg=5071db'
}: Organization);

export const context = {
  model: [orgOne, orgTwo]
};
