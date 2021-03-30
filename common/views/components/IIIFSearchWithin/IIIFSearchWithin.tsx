import { useState, useContext, FunctionComponent, RefObject } from 'react';
import { getSearchService } from '../../../utils/iiif';
import fetch from 'isomorphic-unfetch';
import TextInput from '@weco/common/views/components/TextInput/TextInput';
import styled from 'styled-components';
import { classNames, font } from '@weco/common/utils/classnames';
import ButtonSolid from '@weco/common/views/components/ButtonSolid/ButtonSolid';
import ItemViewerContext from '../ItemViewerContext/ItemViewerContext';
import { FixedSizeList } from 'react-window';
import Space from '@weco/common/views/components/styled/Space';
import LL from '@weco/common/views/components/styled/LL';
import Raven from 'raven-js';
import { searchWithinLabel } from '@weco/common/text/aria-labels';

type Props = {
  mainViewerRef: RefObject<FixedSizeList>;
};

const SearchForm = styled.form`
  position: relative;
`;

const SearchInputWrapper = styled.div`
  input {
    padding-right: 70px;
  }
`;

const SearchButtonWrapper = styled.div.attrs({
  className: classNames({
    absolute: true,
  }),
})`
  top: 50%;
  transform: translateY(-50%);
  right: 4px;
`;

const ResultsHeader = styled(Space).attrs({
  as: 'h3',
  v: { size: 'm', properties: ['margin-top'] },
})`
  border-bottom: 1px solid ${props => props.theme.color('silver')};
  padding-bottom: ${props => `${props.theme.spacingUnit}px`};
`;

const ListItem = styled.li`
  list-style: none;
  border-bottom: 1px solid ${props => props.theme.color('silver')};
`;

const ListLink = styled.a.attrs({
  className: classNames({
    [font('hnl', 6)]: true,
  }),
})`
  display: block;
  padding: ${props => `${props.theme.spacingUnit * 2}px 0`};
  background: ${props => props.theme.color('transparent')};
  &:hover {
    background: ${props => props.theme.color('black')};
  }
`;

const HitData = styled(Space).attrs({
  as: 'span',
  className: classNames({
    [font('hnm', 6)]: true,
  }),
})`
  display: block;
  background: ${props => props.theme.color('charcoal')};
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
  const [value, setValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const {
    setActiveIndex,
    manifest,
    searchResults,
    setSearchResults,
    canvases,
  } = useContext(ItemViewerContext);
  const searchService = manifest && getSearchService(manifest);
  async function getSearchResults() {
    if (searchService) {
      setIsLoading(true);
      try {
        const results = await (
          await fetch(`${searchService['@id']}?q=${value}`)
        ).json();
        setIsLoading(false);
        setSearchResults(results);
      } catch (error) {
        Raven.captureException(new Error(`IIIF search error: ${error}`));
      }
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
        <span
          className={classNames({
            [font('hnm', 5)]: true,
          })}
        >
          Search within this item
        </span>
        <SearchInputWrapper className="relative">
          <TextInput
            id={'searchWithin'}
            label={'Enter keyword'}
            name="query"
            value={value}
            setValue={setValue}
            required={true}
            aria-label={searchWithinLabel}
          />
          <SearchButtonWrapper>
            <ButtonSolid
              isBig
              icon="search"
              text="search"
              isTextHidden={true}
            />
          </SearchButtonWrapper>
        </SearchInputWrapper>
      </SearchForm>
      <div aria-live="polite">
        {isLoading && <Loading />}
        {searchResults.within.total !== null && (
          <ResultsHeader>
            {searchResults.within.total}{' '}
            {searchResults.within.total === 1 ? 'result' : 'results'}
          </ResultsHeader>
        )}
        <ul className="no-padding">
          {searchResults.hits.map((hit, i) => {
            // We need the matching resource for each hit annotation in order to get the matching characters for each individual hit and also the canvas it appears on
            const matchingResources = hit.annotations.map(annotation => {
              return searchResults.resources.find(
                resource => resource['@id'] === annotation
              );
            });
            // Get the index of the canvas the hits appear on
            const match = matchingResources?.[0]?.on.match(/\/canvas\/c(\d+)#/);
            const index = match && Number(match[1]);
            const matchingCanvas = index && canvases[index];
            return (
              <ListItem key={i}>
                <ListLink
                  style={{ textDecoration: 'none', cursor: 'pointer' }}
                  onClick={() => {
                    if (index) {
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
                    } ${index &&
                      `found on image ${index + 1} / ${canvases &&
                        canvases.length}`} ${
                      matchingCanvas && matchingCanvas.label.trim() !== '-'
                        ? ` (page ${matchingCanvas.label})`
                        : ''
                    }`}
                  </HitData>
                  ...{hit.before}
                  {/* Use the resource.chars to display the matches individually, rather than hit.match which groups them as a single string */}
                  {matchingResources.map((resource, i) => (
                    <span key={i}>
                      <span
                        style={{
                          background: '#944aa0',
                          color: 'white',
                        }}
                      >
                        {resource?.resource?.chars}
                      </span>
                      {matchingResources[i + 1] ? ' ... ' : ''}
                    </span>
                  ))}
                  {hit.after}...
                </ListLink>
              </ListItem>
            );
          })}
        </ul>
      </div>
    </>
  );
};

export default IIIFSearchWithin;
