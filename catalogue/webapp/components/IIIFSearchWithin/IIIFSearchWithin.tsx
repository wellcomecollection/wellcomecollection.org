import { useRouter } from 'next/router';
import {
  useState,
  useContext,
  useEffect,
  FunctionComponent,
  useRef,
} from 'react';
import TextInput from '@weco/common/views/components/TextInput/TextInput';
import styled from 'styled-components';
import { font } from '@weco/common/utils/classnames';
import ButtonSolid from '@weco/common/views/components/ButtonSolid/ButtonSolid';
import ItemViewerContext, {
  results,
} from '../ItemViewerContext/ItemViewerContext';
import Space from '@weco/common/views/components/styled/Space';
import LL from '@weco/common/views/components/styled/LL';
import ClearSearch from '@weco/common/views/components/ClearSearch/ClearSearch';
import { search } from '@weco/common/icons';
import { themeValues } from '@weco/common/views/themes/config';
import { toLink as itemLink } from '@weco/catalogue/components/ItemLink';
import NextLink from 'next/link';
import { arrayIndexToQueryParam } from '@weco/catalogue/components/IIIFViewer/IIIFViewer';
import { SearchResults } from '@weco/catalogue/services/iiif/types/search/v3';
import { TransformedCanvas } from '@weco/catalogue/types/manifest';

const Highlight = styled.span`
  background: ${props => props.theme.color('accent.purple')};
  color: ${props => props.theme.color('white')};
`;

const SearchForm = styled.form`
  position: relative;
  display: flex;
`;

const SearchInputWrapper = styled.div`
  position: relative;
  flex: 1 1 auto;
`;

const SearchButtonWrapper = styled.div`
  margin-left: 4px;

  button {
    height: 100%;
  }
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
  className: font('intr', 6),
})`
  display: block;
  padding: ${props => `${props.theme.spacingUnit * 2}px 0`};
  color: ${props => props.theme.color('white')};

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

const ResultsList = styled.ul`
  padding: 0;
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

type HitProps = {
  hit: SearchResults['hits'][0];
  matchingCanvas: TransformedCanvas | undefined;
  matchingCanvasParam: number;
  totalCanvases: number | undefined;
};

const Hit: FunctionComponent<HitProps> = ({
  hit,
  matchingCanvas,
  matchingCanvasParam,
  totalCanvases,
}: HitProps) => {
  const label =
    matchingCanvas?.label && matchingCanvas.label.trim() !== '-'
      ? ` (page ${matchingCanvas?.label})`
      : '';
  return (
    <>
      <HitData v={{ size: 's', properties: ['margin-bottom'] }}>
        {`Found on image ${matchingCanvasParam}${
          totalCanvases ? ` / ${totalCanvases}` : ''
        }`}
        {label}
      </HitData>
      <span role="presentation">…{hit.before}</span>
      <Highlight>{hit.match}</Highlight>
      <span role="presentation">{hit.after}...</span>
    </>
  );
};

const IIIFSearchWithin: FunctionComponent = () => {
  const router = useRouter();
  const inputRef = useRef<HTMLInputElement>(null);
  const {
    transformedManifest,
    searchResults,
    setSearchResults,
    setIsMobileSidebarActive,
    query,
    work,
  } = useContext(ItemViewerContext);
  const [value, setValue] = useState(query.query);
  const [isLoading, setIsLoading] = useState(false);
  const { searchService, canvases } = { ...transformedManifest };

  function handleClearResults() {
    const link = itemLink({
      workId: work.id,
      props: {
        manifest: query.manifest,
        canvas: query.canvas,
      },
      source: 'search_within_clear',
    });
    setSearchResults(results);
    router.replace(link.href, link.as);
  }

  async function getSearchResults() {
    if (searchService && query.query.length > 0) {
      setIsLoading(true);
      try {
        const results = await (
          await fetch(`${searchService['@id']}?q=${query.query}`)
        ).json();
        setIsLoading(false);
        setSearchResults(results);
      } catch (error) {}
    } else {
      setSearchResults(results);
    }
  }

  useEffect(() => {
    getSearchResults();
  }, [query.query, query.manifest]);

  return (
    <>
      <SearchForm
        action={router.asPath}
        onSubmit={event => {
          event.preventDefault();
          const link = itemLink({
            workId: work.id,
            props: {
              canvas: query.canvas,
              manifest: query.manifest,
              query: value,
            },
            source: 'search_within_submit',
          });
          router.replace(link.href, link.as);
        }}
      >
        <input type="hidden" name="canvas" value={query.canvas} />
        <input type="hidden" name="manifest" value={query.manifest} />
        <SearchInputWrapper>
          <TextInput
            id="searchWithin"
            label="Search within this item"
            name="query"
            value={value}
            setValue={setValue}
            required={true}
            ref={inputRef}
            darkBg
          />
          {value !== '' && (
            <ClearSearch
              inputRef={inputRef}
              gaEvent={{
                category: 'IIIFViewer',
                action: 'clear search',
                label: 'item-search-within',
              }}
              clickHandler={handleClearResults}
              setValue={setValue}
              right={10}
            />
          )}
        </SearchInputWrapper>
        <SearchButtonWrapper>
          <ButtonSolid
            icon={search}
            text="search"
            isTextHidden={true}
            colors={themeValues.buttonColors.yellowYellowBlack}
          />
        </SearchButtonWrapper>
      </SearchForm>
      <div aria-live="polite">
        {isLoading && <Loading />}
        {Boolean(searchResults.within.total !== null && query.query) && (
          <ResultsHeader data-test-id="results-header">
            {searchResults.within.total}{' '}
            {searchResults.within.total === 1 ? 'result' : 'results'}
          </ResultsHeader>
        )}
        <ResultsList>
          {searchResults.hits.map((hit, i) => {
            // We need the matching resource for each hit to get the canvas it appears on
            const matchingResources = hit.annotations
              .map(annotation => {
                return searchResults.resources.find(
                  resource => resource['@id'] === annotation
                );
              })
              .filter(Boolean)
              .filter(resource => resource?.resource?.chars);
            // Get the index of the canvas the hits appear on
            const index = canvases?.findIndex(canvas => {
              const matchingPathname = matchingResources?.[0]?.on || '';
              return (
                new URL(matchingPathname).pathname ===
                new URL(canvas.id).pathname
              );
            });
            const matchingCanvas = (index && canvases?.[index]) || undefined;
            return (
              <ListItem key={i}>
                <SearchResult>
                  <NextLink
                    replace={true}
                    {...itemLink({
                      workId: work.id,
                      props: {
                        manifest: query.manifest,
                        query: query.query,
                        canvas: arrayIndexToQueryParam(index || 0),
                      },
                      source: 'search_within_result',
                    })}
                    onClick={() => setIsMobileSidebarActive(false)}
                  >
                    <Hit
                      hit={hit}
                      matchingCanvas={matchingCanvas}
                      matchingCanvasParam={arrayIndexToQueryParam(index || 0)}
                      totalCanvases={canvases?.length}
                    />
                  </NextLink>
                </SearchResult>
              </ListItem>
            );
          })}
        </ResultsList>
      </div>
    </>
  );
};

export default IIIFSearchWithin;
