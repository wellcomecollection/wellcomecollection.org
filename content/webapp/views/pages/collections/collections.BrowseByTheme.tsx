import { useEffect, useState } from 'react';

import { useAppContext } from '@weco/common/contexts/AppContext';
import LL from '@weco/common/views/components/styled/LL';
import SelectableTags from '@weco/content/views/components/SelectableTags';

const BrowseByTheme = () => {
  const [selectedTheme, setSelectedTheme] = useState<string[]>(['featured']);
  const [isLoaded, setIsLoaded] = useState(false);
  const { isEnhanced } = useAppContext();

  useEffect(() => {
    setIsLoaded(true);
  }, []);

  if (!isLoaded && !isEnhanced) return <LL $small />;

  return isEnhanced ? (
    <>
      <SelectableTags
        tags={[
          { id: 'featured', label: 'Featured', controls: 'featured-results' },
          { id: 'new', label: 'New', controls: 'new-results' },
          {
            id: 'manuscripts',
            label: 'Manuscripts',
            controls: 'manuscripts-results',
          },
          { id: 'archives', label: 'Archives', controls: 'archives-results' },
          { id: 'books', label: 'Books', controls: 'books-results' },
          { id: 'objects', label: 'Objects', controls: 'objects-results' },
        ]}
        onChange={setSelectedTheme}
      />

      {selectedTheme.length > 0 && (
        <div aria-live="polite">
          {selectedTheme.includes('featured') && (
            <div id="featured-results">
              <p>Featured</p>
            </div>
          )}

          {selectedTheme.includes('new') && (
            <div id="new-results">
              <p>New</p>
            </div>
          )}

          {selectedTheme.includes('manuscripts') && (
            <div id="manuscripts-results">
              <p>Manuscripts</p>
            </div>
          )}

          {selectedTheme.includes('archives') && (
            <div id="archives-results">
              <p>Archives</p>
            </div>
          )}

          {selectedTheme.includes('books') && (
            <div id="books-results">
              <p>Books</p>
            </div>
          )}

          {selectedTheme.includes('objects') && (
            <div id="objects-results">
              <p>Objects</p>
            </div>
          )}
        </div>
      )}
    </>
  ) : (
    <>
      <h3>Featured</h3>
      <div id="featured">
        <p>Featured</p>
      </div>
    </>
  );
};

export default BrowseByTheme;
