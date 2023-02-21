import React, {
  FunctionComponent,
  ReactElement,
  useRef,
  useState,
  useContext,
} from 'react';
import styled from 'styled-components';

import { font } from '@weco/common/utils/classnames';
import Space from '@weco/common/views/components/styled/Space';
import Icon from '@weco/common/views/components/Icon/Icon';
import { SearchFiltersSharedProps } from '@weco/common/views/components/SearchFilters';

import ModalMoreFilters from '@weco/common/views/components/ModalMoreFilters/ModalMoreFilters';
import ButtonSolid, {
  ButtonTypes,
} from '@weco/common/views/components/ButtonSolid/ButtonSolid';
import { filter } from '@weco/common/icons';
import { themeValues } from '@weco/common/views/themes/config';
import { AppContext } from '@weco/common/views/components/AppContext/AppContext';

import { ResetActiveFilters } from './ResetActiveFilters';
import DynamicFilterArray from './SearchFilters.Desktop.DynamicFilters';
import CheckboxFilter from './SearchFilters.Desktop.CheckboxFilter';
import DesktopDateRangeFilter from './SearchFilters.Desktop.DateRangeFilter';
import DesktopColorFilter from './SearchFilters.Desktop.ColorFilter';

const Wrapper = styled(Space).attrs<{ isNewStyle?: boolean }>(props => ({
  v: {
    size: 'm',
    properties: [props.isNewStyle ? '' : 'padding-top'],
  },
}))<{ isNewStyle?: boolean }>`
  display: flex;
  background-color: ${props =>
    props.isNewStyle ? 'unset' : props.theme.color('warmNeutral.400')};
`;

const FilterDropdownsContainer = styled(Space).attrs({
  v: { size: 'm', properties: ['margin-bottom'] },
  className: font('intr', 5),
})<{ isEnhanced?: boolean; isNewStyle?: boolean }>`
  display: flex;
  align-items: ${props => (props.isNewStyle ? 'center' : 'stretch')};

  // Wrap if old style or if new style without Javascript
  ${props =>
    (!props.isNewStyle || (props.isNewStyle && !props.isEnhanced)) &&
    `flex-wrap: wrap;`}
`;

const nVisibleFilters = 3;

const SearchFiltersDesktop: FunctionComponent<SearchFiltersSharedProps> = ({
  query,
  changeHandler,
  filters,
  linkResolver,
  activeFiltersCount,
  searchFormId,
  isNewStyle,
  hasNoResults,
}: SearchFiltersSharedProps): ReactElement<SearchFiltersSharedProps> => {
  const { isEnhanced } = useContext(AppContext);
  const [showMoreFiltersModal, setShowMoreFiltersModal] = useState(false);
  const wrapperRef = useRef<HTMLDivElement>(null);
  const openMoreFiltersButtonRef = useRef(null);

  const visibleFilters = filters.slice(0, nVisibleFilters);
  const modalFilters = filters.slice(nVisibleFilters);

  return (
    <>
      <Wrapper isNewStyle={isNewStyle} ref={wrapperRef}>
        <Space
          h={{
            size: 'm',
            properties: isNewStyle
              ? ['padding-right']
              : ['padding-left', 'padding-right'],
          }}
          className="flex flex--h-space-between flex--v-center full-width flex--wrap"
        >
          <FilterDropdownsContainer
            isNewStyle={isNewStyle}
            isEnhanced={isEnhanced}
          >
            {isNewStyle && (
              <>
                {isEnhanced && (
                  /**
                   * I had to extract this component so that useLayoutEffect
                   * didn't try to run before it could/cause syncing issues
                   */
                  <DynamicFilterArray
                    showMoreFiltersModal={showMoreFiltersModal}
                    setShowMoreFiltersModal={setShowMoreFiltersModal}
                    wrapperRef={wrapperRef}
                    isNewStyle={isNewStyle}
                    changeHandler={changeHandler}
                    searchFormId={searchFormId}
                    filters={filters}
                    openMoreFiltersButtonRef={openMoreFiltersButtonRef}
                    hasNoResults={hasNoResults}
                  />
                )}
                <ModalMoreFilters
                  {...((showMoreFiltersModal || !isEnhanced) && {
                    form: searchFormId,
                  })}
                  id="moreFilters"
                  isActive={showMoreFiltersModal}
                  setIsActive={setShowMoreFiltersModal}
                  openMoreFiltersButtonRef={openMoreFiltersButtonRef}
                  changeHandler={changeHandler}
                  resetFilters={linkResolver({ query })}
                  filters={filters}
                  hasNoResults={hasNoResults}
                  isNewStyle
                />
              </>
            )}

            {!isNewStyle && (
              <>
                <Space
                  as="span"
                  h={{ size: 'm', properties: ['margin-right'] }}
                  className="flex flex--v-center"
                >
                  <Icon icon={filter} />
                  <Space
                    h={{ size: 's', properties: ['margin-left'] }}
                    className={font('intb', 5)}
                  >
                    Filter by
                  </Space>
                </Space>
                {visibleFilters.map((f, i, arr) => {
                  return (
                    <Space
                      // TODO remove index from key once we resolve the doubled IDs issue
                      // (https://github.com/wellcomecollection/wellcomecollection.org/issues/9109)
                      // as we now sometimes get "Warning: Encountered two children with the same key" console errors
                      key={`${f.id}-${i}`}
                      h={
                        i + 1 !== arr.length
                          ? { size: 's', properties: ['margin-right'] }
                          : undefined
                      }
                      v={{ size: 'xs', properties: ['margin-bottom'] }}
                    >
                      {f.type === 'checkbox' && (
                        <CheckboxFilter
                          f={f}
                          changeHandler={changeHandler}
                          form={searchFormId}
                          isNewStyle={isNewStyle}
                        />
                      )}

                      {f.type === 'dateRange' && (
                        <DesktopDateRangeFilter
                          f={f}
                          changeHandler={changeHandler}
                          form={searchFormId}
                          isNewStyle={isNewStyle}
                        />
                      )}

                      {f.type === 'color' && (
                        <DesktopColorFilter
                          name={f.id}
                          color={f.color}
                          onChangeColor={changeHandler}
                          form={searchFormId}
                          isNewStyle={isNewStyle}
                        />
                      )}
                    </Space>
                  );
                })}

                {modalFilters.length > 0 && (
                  <Space h={{ size: 's', properties: ['margin-left'] }}>
                    {isEnhanced && (
                      <ButtonSolid
                        colors={themeValues.buttonColors.whiteWhiteCharcoal}
                        hoverUnderline={true}
                        size="small"
                        type={ButtonTypes.button}
                        text="More filters"
                        clickHandler={event => {
                          event.preventDefault();
                          setShowMoreFiltersModal(true);
                        }}
                        ref={openMoreFiltersButtonRef}
                      />
                    )}
                    <ModalMoreFilters
                      id="moreFilters"
                      isActive={showMoreFiltersModal}
                      setIsActive={setShowMoreFiltersModal}
                      openMoreFiltersButtonRef={openMoreFiltersButtonRef}
                      changeHandler={changeHandler}
                      resetFilters={linkResolver({ query })}
                      filters={modalFilters}
                      form={searchFormId}
                    />
                  </Space>
                )}
              </>
            )}
          </FilterDropdownsContainer>
        </Space>
      </Wrapper>

      {activeFiltersCount > 0 && (
        <ResetActiveFilters
          query={query}
          linkResolver={linkResolver}
          resetFilters={linkResolver({ query })}
          filters={filters}
          isNewStyle={isNewStyle}
        />
      )}
    </>
  );
};

export default SearchFiltersDesktop;
