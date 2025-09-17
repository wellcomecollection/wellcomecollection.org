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
          { id: 'featured', label: 'Featured' },
          { id: 'new', label: 'New' },
          { id: 'manuscripts', label: 'Manuscripts' },
          { id: 'archives', label: 'Archives' },
          { id: 'books', label: 'Books' },
          { id: 'objects', label: 'Objects' },
        ]}
        onChange={setSelectedTheme}
        isMultiSelect
      />

      {selectedTheme.length > 0 && (
        <div aria-live="polite">
          {selectedTheme.includes('featured') && (
            <div id="featured">
              <p>Featured</p>
            </div>
          )}

          {selectedTheme.includes('new') && (
            <div id="new">
              <p>New</p>
            </div>
          )}

          {selectedTheme.includes('manuscripts') && (
            <div id="manuscripts">
              <p>Manuscripts</p>
            </div>
          )}

          {selectedTheme.includes('archives') && (
            <div id="archives">
              <p>Archives</p>
            </div>
          )}

          {selectedTheme.includes('books') && (
            <div id="books">
              <p>Books</p>
            </div>
          )}

          {selectedTheme.includes('objects') && (
            <div id="objects">
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
