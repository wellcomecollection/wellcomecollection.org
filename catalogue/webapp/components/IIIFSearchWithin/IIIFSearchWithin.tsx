import {
  useState,
  useContext,
  FunctionComponent,
  RefObject,
  useRef,
} from 'react';
import TextInput from '@weco/common/views/components/TextInput/TextInput';
import styled from 'styled-components';
import { font } from '@weco/common/utils/classnames';
import ButtonSolid from '@weco/common/views/components/ButtonSolid/ButtonSolid';
import ItemViewerContext from '../ItemViewerContext/ItemViewerContext';
import { FixedSizeList } from 'react-window';
import Space from '@weco/common/views/components/styled/Space';
import LL from '@weco/common/views/components/styled/LL';
import ClearSearch from '@weco/common/views/components/ClearSearch/ClearSearch';
import { search } from '@weco/common/icons';

type Props = {
  mainViewerRef: RefObject<FixedSizeList>;
};

const SearchForm = styled.form`
  position: relative;
`;

const SearchInputWrapper = styled.div`
  position: relative;
  input {
    padding-right: 70px;
  }
`;

const SearchButtonWrapper = styled.div`
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  right: 4px;
`;

const ResultsHeader = styled(Space).attrs({
  as: 'h3',
  v: { size: 'm', properties: ['margin-top'] },
})`
  border-bottom: 1px solid ${props => props.theme.color('neutral.500')};
  padding-bottom: ${props => `${props.theme.spacingUnit}px`};
`;

const ListItem = styled.li`
  list-style: none;
  border-bottom: 1px solid ${props => props.theme.color('neutral.500')};
`;

const SearchResult = styled.button.attrs({
  className: `${font('intr', 6)} plain-button`,
})`
  cursor: pointer;
  display: block;
  padding: ${props => `${props.theme.spacingUnit * 2}px 0`};
  color: ${props => props.theme.color('white')};
  background: transparent;
  &:hover {
    background: ${props => props.theme.color('black')};
  }
`;

const HitData = styled(Space).attrs({
  as: 'span',
  className: font('intb', 6),
})`
  display: block;
  background: ${props => props.theme.color('neutral.700')};
  padding: ${props => `0 ${props.theme.spacingUnit}px`};
`;

const Loading = () => (
  <div
    style={{
      position: 'relative',
      width: '100%',
      height: '80px',
    }}
  >
    <LL small={true} lighten={true} />
    <span className="visually-hidden">Loading</span>
  </div>
);

const IIIFSearchWithin: FunctionComponent<Props> = ({
  mainViewerRef,
}: Props) => {
  const inputRef = useRef<HTMLInputElement>(null);
  const [value, setValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const {
    setActiveIndex,
    manifest,
    searchResults,
    setSearchResults,
    canvases,
    setIsMobileSidebarActive,
  } = useContext(ItemViewerContext);
  async function getSearchResults() {
    if (manifest?.v2.searchService) {
      setIsLoading(true);
      try {
        const results = await (
          await fetch(`${manifest?.v2.searchService['@id']}?q=${value}`)
        ).json();
        setIsLoading(false);
        setSearchResults(results);
      } catch (error) {}
    }
  }
  return (
    <>
      <SearchForm
        action="/"
        onSubmit={event => {
          event.preventDefault();
          getSearchResults();
        }}
      >
        <SearchInputWrapper>
          <TextInput
            id="searchWithin"
            label="Search within this item"
            name="query"
            value={value}
            setValue={setValue}
            required={true}
            ref={inputRef}
          />
          {value !== '' && (
            <ClearSearch
              inputRef={inputRef}
              gaEvent={{
                category: 'IIIFViewer',
                action: 'clear search',
                label: 'item-search-within',
              }}
              setValue={setValue}
              right={68}
            />
          )}
          <SearchButtonWrapper>
            <ButtonSolid
              size="large"
              icon={search}
              text="search"
              isTextHidden={true}
            />
          </SearchButtonWrapper>
        </SearchInputWrapper>
      </SearchForm>
      <div aria-live="polite">
        {isLoading && <Loading />}
        {searchResults.within.total !== null && (
          <ResultsHeader data-test-id="results-header">
            {searchResults.within.total}{' '}
            {searchResults.within.total === 1 ? 'result' : 'results'}
          </ResultsHeader>
        )}
        <ul className="no-padding">
          {searchResults.hits.map((hit, i) => {
            // We need the matching resource for each hit annotation in order to get the matching characters for each individual hit and also the canvas it appears on
            const matchingResources = hit.annotations
              .map(annotation => {
                return searchResults.resources.find(
                  resource => resource['@id'] === annotation
                );
              })
              .filter(Boolean)
              .filter(resource => resource?.resource?.chars);
            // Get the index of the canvas the hits appear on
            const index = canvases.findIndex(canvas => {
              const matchingPathname = matchingResources?.[0]?.on || '';
              return (
                new URL(matchingPathname).pathname ===
                new URL(canvas['@id']).pathname
              );
            });
            const matchingCanvas = index && canvases[index];
            return (
              <ListItem key={i}>
                <SearchResult
                  onClick={() => {
                    if (index) {
                      setIsMobileSidebarActive(false);
                      setActiveIndex(index || 0);
                      mainViewerRef &&
                        mainViewerRef.current &&
                        mainViewerRef.current.scrollToItem(index || 0, 'start');
                    }
                  }}
                >
                  <HitData v={{ size: 's', properties: ['margin-bottom'] }}>
                    {`${hit.annotations.length} ${
                      hit.annotations.length === 1 ? 'instance' : 'instances'
                    } ${
                      index &&
                      `found on image ${index + 1} / ${
                        canvases && canvases.length
                      }`
                    } ${
                      matchingCanvas && matchingCanvas.label.trim() !== '-'
                        ? ` (page ${matchingCanvas.label})`
                        : ''
                    }`}
                  </HitData>
                  <span role="presentation">…{hit.before}</span>
                  {/* Use the resource.chars to display the matches individually, rather than hit.match which groups them as a single string */}
                  {matchingResources.map((resource, i) => {
                    return (
                      resource && (
                        <span key={i}>
                          <span
                            style={{
                              background: '#944aa0',
                              color: 'white',
                            }}
                          >
                            {resource.resource.chars}
                          </span>
                          {matchingResources[i + 1] ? ' … ' : ''}
                        </span>
                      )
                    );
                  })}
                  <span role="presentation">{hit.after}...</span>
                </SearchResult>
              </ListItem>
            );
          })}
        </ul>
      </div>
    </>
  );
};

export default IIIFSearchWithin;
