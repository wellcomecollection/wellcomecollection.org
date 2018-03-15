import withBody from './parts/with-body';
import title from './parts/title';
import description from './parts/description';

const Installations = withBody({
  Installation: {
    title,
    description
  }
});

export default Installations;
