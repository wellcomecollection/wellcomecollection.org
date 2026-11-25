import fs from 'fs';
import path from 'path';

/**
 * Component READMEs end with an "Edit this Readme on GitHub" link whose path is
 * written by hand, so it rots silently whenever a component moves.
 */
const repoRoot = path.resolve(__dirname, '../..');

const editLinkBase =
  'https://github.com/wellcomecollection/wellcomecollection.org/edit/main/';

const ignoredDirs = new Set(['node_modules', '.git', '.next', '.dist']);

const findReadmes = (dir: string): string[] =>
  fs.readdirSync(dir, { withFileTypes: true }).flatMap(entry => {
    if (ignoredDirs.has(entry.name)) return [];

    const fullPath = path.join(dir, entry.name);

    if (entry.isDirectory()) return findReadmes(fullPath);

    return entry.name.endsWith('README.mdx') ? [fullPath] : [];
  });

// Relative to the repo root, which is the form the links use
const readmes = findReadmes(repoRoot).map(file =>
  path.relative(repoRoot, file)
);

const linkedPath = (file: string): string | undefined => {
  const contents = fs.readFileSync(path.join(repoRoot, file), 'utf8');
  const start = contents.indexOf(editLinkBase);

  if (start === -1) return undefined;

  return contents.slice(
    start + editLinkBase.length,
    contents.indexOf(')', start)
  );
};

const readmesWithEditLink = readmes.filter(
  file => linkedPath(file) !== undefined
);

describe('README edit links', () => {
  // A guard on the search itself: a pattern that quietly matches nothing, or
  // fewer files than expected, would otherwise make every check below pass
  it('finds the READMEs to check', () => {
    expect(readmesWithEditLink.length).toBeGreaterThan(30);
  });

  it.each(readmesWithEditLink)('%s points at its own path', file => {
    expect(linkedPath(file)).toBe(file);
  });
});
