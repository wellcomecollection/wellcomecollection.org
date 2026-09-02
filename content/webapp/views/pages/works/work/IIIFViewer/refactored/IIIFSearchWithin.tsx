import NextLink from 'next/link';
import { useRouter } from 'next/router';
import { FunctionComponent, useEffect, useRef, useState } from 'react';
import styled, { useTheme } from 'styled-components';

import { search } from '@weco/common/icons';
import { typography } from '@weco/common/utils/classnames';
import { pluralize } from '@weco/common/utils/grammar';
import Button from '@weco/common/views/components/Buttons';
import LL from '@weco/common/views/components/styled/LL';
import Space from '@weco/common/views/components/styled/Space';
import TextInput from '@weco/common/views/components/TextInput';
import { useItemViewerContext } from '@weco/content/contexts/ItemViewerContext';
import {
  emptySearchResults,
  SearchResults,
} from '@weco/content/services/iiif/types/search/v3';
import { searchWithinLabel } from '@weco/content/text/aria-labels';
import { TransformedCanvas } from '@weco/content/types/manifest';
import {
  ItemProps,
  toWorksItemLink,
} from '@weco/content/views/components/ItemLink';
import {
  arrayIndexToQueryParam,
  getThumbnailsPageForCanvas,
} from '@weco/content/views/pages/works/work/work.helpers';

const SearchForm = styled.form`
  position: relative;
  display: flex;
  align-items: flex-end;
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

const ErrorMessage = styled(Space).attrs({
  as: 'p',
  $v: { size: 'sm', properties: ['margin-top'] },
  className: typography('body', 'sm', 'regular'),
})``;

const ResultsHeader = styled(Space).attrs({
  as: 'h3',
  $v: { size: 'sm', properties: ['margin-top'] },
})`
  border-bottom: 1px solid ${props => props.theme.color('neutral.500')};
  padding-bottom: ${props => `${props.theme.spacingUnit}px`};
`;

const ResultsList = styled.ul`
  padding: 0;
`;

const ListItem = styled.li.attrs({
  className: typography('body', 'sm', 'regular'),
})`
  list-style: none;
  border-bottom: 1px solid ${props => props.theme.color('neutral.500')};

  a {
    display: block;
    padding: ${props => `${props.theme.spacingUnit * 2}px`};
    color: ${props => props.theme.color('white')};

    &:hover {
      background: ${props => props.theme.color('black')};
    }
  }
`;

const HitData = styled(Space).attrs({
  as: 'span',
  className: typography('body', 'sm', 'strong'),
})`
  display: block;
`;

const Highlight = styled.span`
  background: ${props => props.theme.color('yellow')};
  color: ${props => props.theme.color('black')};
`;

const Loading = () => (
  <div
    style={{
      position: 'relative',
      width: '100%',
      height: '80px',
    }}
  >
    <LL $small $lighten />
    <span className="visually-hidden">Loading</span>
  </div>
);

type HitProps = {
  hit: SearchResults['hits'][0];
  matchingCanvas: TransformedCanvas | undefined;
  matchingCanvasNumber: number;
  totalCanvases: number | undefined;
};

const Hit: FunctionComponent<HitProps> = ({
  hit,
  matchingCanvas,
  matchingCanvasNumber,
  totalCanvases,
}: HitProps) => {
  const label =
    matchingCanvas?.label && matchingCanvas.label.trim() !== '-'
      ? ` (page ${matchingCanvas?.label})`
      : '';
  return (
    <>
      <HitData $v={{ size: 'xs', properties: ['margin-bottom'] }}>
        {`Found on image ${matchingCanvasNumber}${
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

// We need the matching resource for each hit to get the canvas it appears on
function findCanvasIndexForHit(
  hit: SearchResults['hits'][0],
  searchResults: SearchResults | null,
  canvases: TransformedCanvas[] | undefined
) {
  const matchingResources = hit.annotations
    .map(annotation =>
      searchResults?.resources?.find(resource => resource['@id'] === annotation)
    )
    .filter(Boolean)
    .filter(resource => resource?.resource?.chars);

  return canvases?.findIndex(canvas => {
    const matchingPathname = matchingResources[0]?.on || '';
    return new URL(matchingPathname).pathname === new URL(canvas.id).pathname;
  });
}

const IIIFSearchWithin: FunctionComponent = () => {
  const router = useRouter();
  const theme = useTheme();
  const inputRef = useRef<HTMLInputElement>(null);
  const formRef = useRef<HTMLFormElement>(null);
  const {
    transformedManifest,
    searchResults,
    setSearchResults,
    setIsMobileSidebarActive,
    query,
    work,
  } = useItemViewerContext();
  const [searchQuery, setSearchQuery] = useState(query.query);
  const [isLoading, setIsLoading] = useState(false);
  const [searchError, setSearchError] = useState(false);
  const { searchService, canvases } = { ...transformedManifest };

  function navigateToItem(props: Partial<ItemProps>) {
    const link = toWorksItemLink({ workId: work.id, props });
    router.replace(link.href);
  }

  function handleClearResults() {
    // Set data attribute to prevent GTM trigger from firing
    if (formRef.current) {
      formRef.current.dataset.gtmIsClearing = 'true';
    }

    setSearchResults(emptySearchResults);
    navigateToItem({
      manifest: query.manifest,
      canvas: query.canvas,
      page: query.page,
    });

    // Remove the attribute after navigation
    if (formRef.current) {
      delete formRef.current.dataset.gtmIsClearing;
    }
  }

  async function getSearchResults() {
    if (searchService && query.query.length > 0) {
      setIsLoading(true);
      const searchServiceId =
        '@id' in searchService ? searchService['@id'] : searchService.id;
      try {
        const fetchedResults = await (
          await fetch(`${searchServiceId}?q=${query.query}`)
        ).json();
        setIsLoading(false);
        setSearchResults(fetchedResults);
      } catch {
        setIsLoading(false);
        setSearchError(true);
      }
    } else {
      setSearchResults(emptySearchResults);
    }
  }

  useEffect(() => {
    getSearchResults();
  }, [query.query, query.manifest]);

  const shouldShowResultsCount =
    !isLoading &&
    searchResults &&
    typeof searchResults?.within?.total === 'number' &&
    query.query;

  return (
    <>
      <SearchForm
        ref={formRef}
        data-gtm-trigger="form-search-within"
        action={router.asPath}
        onSubmit={event => {
          event.preventDefault();
          navigateToItem({
            canvas: query.canvas,
            manifest: query.manifest,
            query: searchQuery,
            page: query.page,
          });
        }}
      >
        <input type="hidden" name="canvas" value={query.canvas} />
        <input type="hidden" name="manifest" value={query.manifest} />
        <input type="hidden" name="page" value={query.page} />
        <SearchInputWrapper>
          <TextInput
            id="searchWithin"
            label={searchWithinLabel}
            type="search"
            name="query"
            value={searchQuery}
            setValue={setSearchQuery}
            ref={inputRef}
            clearHandler={handleClearResults}
            hasClearButton
            required
          />
        </SearchInputWrapper>
        <SearchButtonWrapper>
          <Button
            variant="ButtonSolid"
            icon={search}
            text="search within"
            colors={theme.buttonColors.yellowYellowBlack}
            isTextHidden
          />
        </SearchButtonWrapper>
      </SearchForm>
      <div aria-live="polite">
        {isLoading && <Loading />}
        {searchError && (
          <ErrorMessage>
            There has been a problem conducting the search.
          </ErrorMessage>
        )}
        {shouldShowResultsCount && (
          <ResultsHeader aria-live="assertive">
            {pluralize(searchResults?.within.total ?? 0, 'result')}
          </ResultsHeader>
        )}
        <ResultsList>
          {searchResults?.hits?.map((hit, i) => {
            const index = findCanvasIndexForHit(hit, searchResults, canvases);
            const matchingCanvas = (index && canvases?.[index]) || undefined;
            return (
              <ListItem key={i}>
                <NextLink
                  {...toWorksItemLink({
                    workId: work.id,
                    props: {
                      manifest: query.manifest,
                      query: query.query,
                      canvas: arrayIndexToQueryParam(index || 0),
                      page: getThumbnailsPageForCanvas({
                        canvasNumber: arrayIndexToQueryParam(index || 0),
                      }),
                    },
                  })}
                  onClick={() => setIsMobileSidebarActive(false)}
                  replace
                >
                  <Hit
                    hit={hit}
                    matchingCanvas={matchingCanvas}
                    matchingCanvasNumber={arrayIndexToQueryParam(index || 0)}
                    totalCanvases={canvases?.length}
                  />
                </NextLink>
              </ListItem>
            );
          })}
        </ResultsList>
      </div>
    </>
  );
};

export default IIIFSearchWithin;
