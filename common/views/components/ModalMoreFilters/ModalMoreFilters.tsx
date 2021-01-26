import React, { FunctionComponent, RefObject } from 'react';
import Modal from '../../components/Modal/Modal';
import { classNames } from '@weco/common/utils/classnames';
import styled from 'styled-components';
import {
  CatalogueAggregations,
  CatalogueAggregationBucket,
} from '@weco/common/model/catalogue';
import Space from '../styled/Space';
import CheckboxRadio from '@weco/common/views/components/CheckboxRadio/CheckboxRadio';
import { searchFilterCheckBox } from '../../../text/arial-labels';
import {
  getAggregationFilterByName,
  getAggregationRadioGroup,
} from '@weco/common/utils/filters';
import RadioGroup from '@weco/common/views/components/RadioGroup/RadioGroup';
import NextLink from 'next/link';
import { worksLink } from '../../../services/catalogue/routes';
import ButtonSolid, {
  ButtonTypes,
} from '@weco/common/views/components/ButtonSolid/ButtonSolid';
import { WorksRouteProps } from '@weco/common/services/catalogue/ts_routes';
type SharedFiltersProps = {
  changeHandler: () => void;
  languagesInUrl: string[];
  genresInUrl: string;
  subjectsInUrl: string;
  filtersToShow: string[];
};
type ModalMoreFiltersProps = {
  id: string;
  showMoreFiltersModal: boolean;
  setMoreFiltersModal: (arg: boolean) => void;
  openMoreFiltersButtonRef: RefObject<HTMLInputElement>;
  aggregations: CatalogueAggregations | undefined;
  filtersToShow: string[];
  worksRouteProps: WorksRouteProps;
  isEnhanced: boolean;
} & SharedFiltersProps;

type MoreFiltersProps = {
  genresFilter: CatalogueAggregationBucket[];
  languagesFilter: CatalogueAggregationBucket[];
  subjectsFilter: CatalogueAggregationBucket[];
} & SharedFiltersProps;

const ModalInner = styled.div`
  display: flex;
  flex-direction: column;
  min-width: 320px;
  max-width: 600px;
  ${props => props.theme.media.large`
    width: 600px;
    top: 10px;
  `}
  position: relative;
  top: 15px;
  overflow-y: auto;
  max-height: 80vh;
`;

// shared styles
const FilterSection = styled(Space).attrs({
  h: { size: 'l', properties: ['padding-left', 'padding-right'] },
  v: { size: 'l', properties: ['padding-top', 'padding-bottom'] },
  className: classNames({
    'border-bottom-width-1 border-color-pumice': true,
  }),
})``;

const FiltersFooter = styled(Space).attrs({
  h: { size: 'l', properties: ['padding-left', 'padding-right'] },
  v: { size: 'l', properties: ['padding-top', 'padding-bottom'] },
  className: classNames({
    'bg-white border-color-pumice border-top-width-1 flex flex--v-center flex--h-space-between': true,
  }),
})`
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  height: 60px;
`;

const FiltersHeader = styled(Space).attrs({
  h: { size: 'm', properties: ['padding-left', 'padding-right'] },
  v: { size: 'm', properties: ['padding-top', 'padding-bottom'] },
  className: classNames({
    'border-color-pumice border-bottom-width-1 absolute': true,
  }),
})`
  text-align: center;
  top: 0px;
  left: 0px;
  width: 100%;
`;

const MoreFilters: FunctionComponent<MoreFiltersProps> = ({
  filtersToShow,
  subjectsFilter,
  genresFilter,
  languagesFilter,
  changeHandler,
  subjectsInUrl,
  genresInUrl,
  languagesInUrl,
}: MoreFiltersProps) => {
  return (
    <>
      {filtersToShow.includes('subjects') && (
        <FilterSection>
          <h3 className="h3">Subjects</h3>
          <Space as="span" h={{ size: 'm', properties: ['margin-right'] }}>
            <div
              className={classNames({
                'no-margin no-padding plain-list': true,
              })}
            >
              {subjectsFilter.length > 0 && (
                <RadioGroup
                  name="subjects.label"
                  selected={subjectsInUrl}
                  onChange={changeHandler}
                  options={getAggregationRadioGroup(subjectsFilter, 'desktop')}
                />
              )}
            </div>
          </Space>
        </FilterSection>
      )}
      {filtersToShow.includes('genres') && (
        <FilterSection>
          <h3 className="h3">Genres</h3>
          <Space as="span" h={{ size: 'm', properties: ['margin-right'] }}>
            <div
              className={classNames({
                'no-margin no-padding plain-list': true,
              })}
            >
              {subjectsFilter.length > 0 && (
                <RadioGroup
                  name="genres.label"
                  selected={genresInUrl}
                  onChange={changeHandler}
                  options={getAggregationRadioGroup(genresFilter, 'mobile')}
                />
              )}
            </div>
          </Space>
        </FilterSection>
      )}
      {filtersToShow.includes('languages') && (
        <FilterSection>
          <h3 className="h3">Languages</h3>
          <Space as="span" h={{ size: 'm', properties: ['margin-right'] }}>
            <ul
              className={classNames({
                'no-margin no-padding plain-list': true,
              })}
            >
              {languagesFilter.length > 0 &&
                languagesFilter.map(language => {
                  const isChecked = languagesInUrl.includes(language.data.id);
                  return (
                    (language.count > 0 || isChecked) && (
                      <Space
                        as="li"
                        v={{ size: 'l', properties: ['margin-bottom'] }}
                        key={`desktop-${language.data.id}`}
                      >
                        <CheckboxRadio
                          id={`desktop-${language.data.id}`}
                          type={`checkbox`}
                          text={`${language.data.label} (${language.count})`}
                          value={language.data.id}
                          name={`languages`}
                          checked={isChecked}
                          onChange={changeHandler}
                          ariaLabel={searchFilterCheckBox(language.data.label)}
                        />
                      </Space>
                    )
                  );
                })}
            </ul>
          </Space>
        </FilterSection>
      )}
    </>
  );
};

const ModalMoreFilters: FunctionComponent<ModalMoreFiltersProps> = ({
  id,
  showMoreFiltersModal,
  setMoreFiltersModal,
  openMoreFiltersButtonRef,
  filtersToShow,
  aggregations,
  changeHandler,
  languagesInUrl,
  genresInUrl,
  subjectsInUrl,
  worksRouteProps,
  isEnhanced,
}: ModalMoreFiltersProps) => {
  const languagesFilter: CatalogueAggregationBucket[] = getAggregationFilterByName(
    aggregations,
    'languages'
  );
  const subjectsFilter: CatalogueAggregationBucket[] = getAggregationFilterByName(
    aggregations,
    'subjects'
  );
  const genresFilter: CatalogueAggregationBucket[] = getAggregationFilterByName(
    aggregations,
    'genres'
  );

  return (
    <>
      <noscript>
        <>
          <MoreFilters
            filtersToShow={filtersToShow}
            subjectsFilter={subjectsFilter}
            genresFilter={genresFilter}
            languagesFilter={languagesFilter}
            changeHandler={changeHandler}
            languagesInUrl={languagesInUrl}
            genresInUrl={genresInUrl}
            subjectsInUrl={subjectsInUrl}
          />
        </>
      </noscript>
      <Modal
        id={id}
        isActive={showMoreFiltersModal}
        setIsActive={setMoreFiltersModal}
        openButtonRef={openMoreFiltersButtonRef}
        overrideDefaultModalStyle={true}
      >
        <FiltersHeader>
          <h3 className="h3">More Filters</h3>
        </FiltersHeader>

        <ModalInner>
          {isEnhanced && (
            <MoreFilters
              filtersToShow={filtersToShow}
              subjectsFilter={subjectsFilter}
              genresFilter={genresFilter}
              languagesFilter={languagesFilter}
              changeHandler={changeHandler}
              languagesInUrl={languagesInUrl}
              genresInUrl={genresInUrl}
              subjectsInUrl={subjectsInUrl}
            />
          )}
        </ModalInner>
        <FiltersFooter>
          <NextLink
            passHref
            {...worksLink(
              {
                query: worksRouteProps.query,
              },
              'cancel_filter/all'
            )}
          >
            <a>Reset filters</a>
          </NextLink>

          <ButtonSolid
            ref={undefined}
            type={ButtonTypes.button}
            clickHandler={() => {
              setMoreFiltersModal(false);
            }}
            text="Show results"
          />
        </FiltersFooter>
      </Modal>
    </>
  );
};

export default ModalMoreFilters;
