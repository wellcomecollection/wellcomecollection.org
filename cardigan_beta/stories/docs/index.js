import { storiesOf } from '@storybook/react';
import { doc }  from 'storybook-readme';

const stories = storiesOf('Documentation', module);
const docs = require.context('./', true, /\.md$/);

docs.keys().forEach(filename => {
  const content = docs(filename);
  const sanitisedFilename = filename
    .slice(0, -2)
    .replace(/[^a-z0-9]/gi, ' ')
    .toLowerCase()
    .trim();
  const title = `${sanitisedFilename.charAt(0).toUpperCase()}${sanitisedFilename.slice(1)}`;
  stories
    .add(title, doc(content));
});
