import title from './parts/title';
import body from './parts/body';
import promo from './parts/promo';
import list from './parts/list';
import link from './parts/link';

const Page = {
  Page: {
    title,
    // We label this as `Site section` for the time that we only support this
    // type of tag
    tags: list('Site section', {
      tag: link('Site section', 'document', ['tags'])
    }),
    body
  },
  Promo: {
    promo
  }
};

export default Page;
