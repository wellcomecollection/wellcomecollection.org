import NextLink from 'next/link';
import { useRouter } from 'next/router';
import { FunctionComponent, useEffect, useRef, useState } from 'react';
import styled, { useTheme } from 'styled-components';

import { search } from '@weco/common/icons';
import { font } from '@weco/common/utils/classnames';
import { pluralize } from '@weco/common/utils/grammar';
import Button from '@weco/common/views/components/Buttons';
import LL from '@weco/common/views/components/styled/LL';
import Space from '@weco/common/views/components/styled/Space';
import TextInput from '@weco/common/views/components/TextInput';
import {
  results,
  useItemViewerContext,
} from '@weco/content/contexts/ItemViewerContext';
import { SearchResults } from '@weco/content/services/iiif/types/search/v3';
import { searchWithinLabel } from '@weco/content/text/aria-labels';
import { TransformedCanvas } from '@weco/content/types/manifest';
import { toWorksItemLink } from '@weco/content/views/components/ItemLink';
import { arrayIndexToQueryParam } from '@weco/content/views/pages/works/work/IIIFViewer';
import { thumbnailsPageSize } from '@weco/content/views/pages/works/work/IIIFViewer/Paginators';

const Highlight = styled.span`
  background: ${props => props.theme.color('yellow')};
  color: ${props => props.theme.color('black')};
`;

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

const ResultsHeader = styled(Space).attrs({
  as: 'h3',
  $v: { size: 'm', properties: ['margin-top'] },
})`
  border-bottom: 1px solid ${props => props.theme.color('neutral.500')};
  padding-bottom: ${props => `${props.theme.spacingUnit}px`};
`;

const ListItem = styled.li.attrs({
  className: font('intr', -2),
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
  className: font('intsb', -2),
})`
  display: block;
`;

const ResultsList = styled.ul`
  padding: 0;
`;

const ErrorMessage = styled(Space).attrs({
  as: 'p',
  $v: { size: 'm', properties: ['margin-top'] },
  className: font('intr', -2),
})``;

const Loading = () => (
  <div
    style={{
      position: 'relative',
      width: '100%',
      height: '80px',
    }}
  >
    <LL $small={true} $lighten={true} />
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
      <HitData $v={{ size: 's', properties: ['margin-bottom'] }}>
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
  const [value, setValue] = useState(query.query);
  const [isLoading, setIsLoading] = useState(false);
  const [searchError, setSearchError] = useState(false);
  const { searchService, canvases } = { ...transformedManifest };

  function handleClearResults() {
    // Set data attribute to prevent GTM trigger from firing
    if (formRef.current) {
      formRef.current.dataset.gtmIsClearing = 'true';
    }

    const link = toWorksItemLink({
      workId: work.id,
      props: {
        manifest: query.manifest,
        canvas: query.canvas,
        page: query.page,
      },
    });
    setSearchResults && setSearchResults(results);
    router.replace(link.href);

    // Remove the attribute after navigation
    if (formRef.current) {
      delete formRef.current.dataset.gtmIsClearing;
    }
  }

  async function getSearchResults() {
    if (searchService && query.query.length > 0) {
      setIsLoading(true);
      try {
        const results = await (
          await fetch(`${searchService['@id']}?q=${query.query}`)
        ).json();
        setIsLoading(false);
        setSearchResults && setSearchResults(results);
      } catch (error) {
        setIsLoading(false);
        setSearchError(true);
      }
    } else {
      setSearchResults && setSearchResults(results);
    }
  }

  useEffect(() => {
    getSearchResults();
  }, [query.query, query.manifest]);

  return (
    <>
      <SearchForm
        ref={formRef}
        data-gtm-trigger="form-search-within"
        action={router.asPath}
        onSubmit={event => {
          event.preventDefault();
          const link = toWorksItemLink({
            workId: work.id,
            props: {
              canvas: query.canvas,
              manifest: query.manifest,
              query: value,
              page: query.page,
            },
          });
          router.replace(link.href);
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
            value={value}
            setValue={setValue}
            required={true}
            ref={inputRef}
            hasClearButton
            clearHandler={handleClearResults}
          />
        </SearchInputWrapper>
        <SearchButtonWrapper>
          <Button
            variant="ButtonSolid"
            icon={search}
            text="search within"
            isTextHidden={true}
            colors={theme.buttonColors.yellowYellowBlack}
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
        {searchResults &&
          Boolean(searchResults?.within?.total && query.query) && (
            <ResultsHeader aria-live="assertive">
              {pluralize(searchResults.within.total ?? 0, 'result')}
            </ResultsHeader>
          )}
        <ResultsList>
          {searchResults?.hits?.map((hit, i) => {
            // We need the matching resource for each hit to get the canvas it appears on
            const matchingResources = hit.annotations
              .map(annotation => {
                return searchResults?.resources?.find(
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
                <NextLink
                  replace={true}
                  {...toWorksItemLink({
                    workId: work.id,
                    props: {
                      manifest: query.manifest,
                      query: query.query,
                      canvas: arrayIndexToQueryParam(index || 0),
                      page: Math.ceil(
                        arrayIndexToQueryParam(index || 0) / thumbnailsPageSize
                      ),
                    },
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
              </ListItem>
            );
          })}
        </ResultsList>
      </div>
    </>
  );
};

export default IIIFSearchWithin;
