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

const IIIFSearchWithin: FunctionComponent<Props> = ({
  mainViewerRef,
}: Props) => {
  const [value, setValue] = useState('');
  const {
    setActiveIndex,
    manifest,
    searchResults,
    setSearchResults,
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
        <h2>{searchResults.within.total} matches</h2>
      )}
      <ul className="no-padding">
        {searchResults.hits.map((hit, i) => {
          const matchingResource = searchResults.resources.find(
            resource => resource['@id'] === hit.annotations[0]
          );
          const match = matchingResource?.on.match(/\/canvas\/c(\d+)#/);
          const index = match && Number(match[1]);
          return (
            <ListItem key={i}>
              <ListLink
                style={{ textDecoration: 'none', cursor: 'pointer' }}
                onClick={() => {
                  setActiveIndex(index || 0);
                  mainViewerRef &&
                    mainViewerRef.current &&
                    mainViewerRef.current.scrollToItem(index || 0, 'start');
                }}
              >
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
                <span
                  style={{
                    background: '#944aa0',
                    color: 'white',
                  }}
                >
                  {hit.match}
                </span>
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
