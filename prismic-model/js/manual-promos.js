import structuredText from './parts/structured-text';
import text from './parts/text';
import image from './parts/image';

const ManualPromo = {
  Contact: {
    title: structuredText('Title', 'single', ['heading1']),
    summary: structuredText('Summary', 'single'),
    image: image('Image'),
    url: text('URL'),
  },
};

export default ManualPromo;
