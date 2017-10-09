import shortid from 'shortid';

export default function generateId(blank) {
  return shortid.generate();
};
