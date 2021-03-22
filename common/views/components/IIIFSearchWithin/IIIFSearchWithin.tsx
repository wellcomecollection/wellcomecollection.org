import { useState, useContext, FunctionComponent, RefObject } from 'react';
import { getSearchService } from '../../../utils/iiif';
// import NextLink from 'next/link'; //TODO
import fetch from 'isomorphic-unfetch';
import TextInput from '@weco/common/views/components/TextInput/TextInput';
// import { itemLink } from '@weco/common/services/catalogue/routes'; //TODO
import styled from 'styled-components';
import { classNames, font } from '@weco/common/utils/classnames';
import ButtonSolid from '@weco/common/views/components/ButtonSolid/ButtonSolid';
import ItemViewerContext from '../ItemViewerContext/ItemViewerContext';
import { FixedSizeList } from 'react-window';
import Space from '@weco/common/views/components/styled/Space';

type Props = {
  mainViewerRef: RefObject<FixedSizeList>;
};

const SearchForm = styled.form`
  position: relative;
`;

const SearchInputWrapper = styled.div`
  font-size: 20px;
  background: ${props => props.theme.color('white')};
  margin-right: 80px;
  .search-query {
    height: ${props => 10 * props.theme.spacingUnit}px;
  }
`;

const SearchButtonWrapper = styled.div.attrs({
  className: classNames({
    absolute: true,
  }),
})`
  top: 0;
  right: 0;
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

const IIIFSearchWithin: FunctionComponent<Props> = ({
  mainViewerRef,
}: Props) => {
  const [value, setValue] = useState('');
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
      try {
        const results = await (
          await fetch(`${searchService['@id']}?q=${value}`)
        ).json();
        setSearchResults(results);
      } catch (e) {
        console.info(e);
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
        {' '}
        <SearchInputWrapper className="relative">
          <TextInput
            id={'searchWithin'}
            label={'Search within this item'}
            placeholder={'Search within this item'}
            name="query"
            value={value}
            setValue={setValue}
            required={true}
          />
        </SearchInputWrapper>
        <SearchButtonWrapper>
          <ButtonSolid icon="search" text="search" isTextHidden={true} />
        </SearchButtonWrapper>
      </SearchForm>
      {searchResults.within.total !== null && (
        <ResultsHeader>
          {searchResults.within.total}{' '}
          {searchResults.within.total === 1 ? 'result' : 'results'}
        </ResultsHeader>
        // to do singular match if required
      )}
      <ul className="no-padding">
        {searchResults.hits.map((hit, i) => {
          // we need the matching resource for each hit annotation in order to get the matching characters for each individual hit and also the canvas it appears on
          const matchingResources = hit.annotations.map(annotation => {
            return searchResults.resources.find(
              resource => resource['@id'] === annotation
            );
          });
          // get the index of the canvas the hits appear on
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
                {/* {matchingResource &&
                  JSON.stringify(matchingResource.on.match('/canvas/c(d+)#'))} */}
                ...{hit.before}
                {/* <NextLink
                  {...itemLink({
                    workId: work.id,
                    langCode: work.language && work.language.id,
                    canvas: canvas,
                    // sierraId: sierraId,
                  })}
                  passHref
                > */}
                {/* use the resource.chars to display the matches individually, rather than hit.match which groups them as a single string */}
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
                {/* </NextLink> */}
                {hit.after}...
              </ListLink>
            </ListItem>
          );
        })}
      </ul>
    </>
  );
};

export default IIIFSearchWithin;
