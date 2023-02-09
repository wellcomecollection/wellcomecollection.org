import React, {
  FunctionComponent,
  ReactElement,
  useEffect,
  useRef,
  useState,
  useLayoutEffect,
} from 'react';
import { useRouter } from 'next/router';
import styled from 'styled-components';

import { font } from '@weco/common/utils/classnames';
import PlainList from '@weco/common/views/components/styled/PlainList';
import Space from '@weco/common/views/components/styled/Space';
import Icon from '@weco/common/views/components/Icon/Icon';
import DropdownButton from '@weco/common/views/components/DropdownButton/DropdownButton';
import CheckboxRadio from '@weco/common/views/components/CheckboxRadio/CheckboxRadio';
import { SearchFiltersSharedProps } from '@weco/common/views/components/SearchFilters/SearchFilters';
import {
  CheckboxFilter as CheckboxFilterType,
  filterLabel,
  Filter,
} from '@weco/common/services/catalogue/filters';
import ModalMoreFilters from '@weco/common/views/components/ModalMoreFilters/ModalMoreFilters';
import { ResetActiveFilters } from './ResetActiveFilters';
import ButtonSolid, {
  ButtonTypes,
} from '@weco/common/views/components/ButtonSolid/ButtonSolid';
import { filter } from '@weco/common/icons';
import { themeValues } from '@weco/common/views/themes/config';
import DateRangeFilter, {
  DateRangeFilterProps,
} from './SearchFilters.DateRange';
import ColorFilter, { ColorFilterProps } from './SearchFilters.Colors';

type CheckboxFilterProps = {
  f: CheckboxFilterType;
  changeHandler: () => void;
  form?: string;
  isNewStyle?: boolean;
};

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
})<{ isComponentMounted?: boolean; isNewStyle?: boolean }>`
  display: flex;
  align-items: ${props => (props.isNewStyle ? 'center' : 'stretch')};

  // Wrap if old style or if new style without Javascript
  ${props =>
    (!props.isNewStyle || (props.isNewStyle && !props.isComponentMounted)) &&
    `flex-wrap: wrap;`}
`;

const CheckboxFilter = ({
  f,
  changeHandler,
  form,
  isNewStyle,
}: CheckboxFilterProps) => {
  return (
    <DropdownButton
      isPill={isNewStyle}
      isFilter
      label={f.label}
      buttonType="inline"
      id={f.id}
      hasNoOptions={f.options.length === 0}
    >
      <PlainList className={font('intr', 5)}>
        {f.options.map(({ id, label, value, count, selected }) => {
          return (
            <li key={`${f.id}-${id}`}>
              <CheckboxRadio
                id={id}
                type="checkbox"
                text={filterLabel({ label, count })}
                value={value}
                name={f.id}
                checked={selected}
                onChange={changeHandler}
                form={form}
              />
            </li>
          );
        })}
      </PlainList>
    </DropdownButton>
  );
};

type DesktopDateRangeFilterProps = DateRangeFilterProps & {
  hasNoOptions?: boolean;
  isNewStyle?: boolean;
};

const DesktopDateRangeFilter = ({
  f,
  changeHandler,
  form,
  hasNoOptions,
  isNewStyle,
}: DesktopDateRangeFilterProps) => {
  return (
    <Space className={font('intr', 5)}>
      <DropdownButton
        isPill={isNewStyle}
        isFilter
        label={f.label}
        buttonType="inline"
        id={f.id}
        hasNoOptions={hasNoOptions}
      >
        <DateRangeFilter f={f} changeHandler={changeHandler} form={form} />
      </DropdownButton>
    </Space>
  );
};

type DesktopColorFilterProps = ColorFilterProps & {
  hasNoOptions?: boolean;
  isNewStyle?: boolean;
};
const DesktopColorFilter = ({
  f,
  changeHandler,
  form,
  hasNoOptions,
  isNewStyle,
}: DesktopColorFilterProps) => {
  return (
    <DropdownButton
      isPill={isNewStyle}
      isFilter
      label="Colours"
      buttonType="inline"
      id="images.color"
      hasNoOptions={hasNoOptions}
    >
      <ColorFilter f={f} changeHandler={changeHandler} form={form} />
    </DropdownButton>
  );
};

const nVisibleFilters = 3;

const DynamicFilterArray = ({
  showMoreFiltersModal,
  setShowMoreFiltersModal,
  wrapperRef,
  isNewStyle,
  changeHandler,
  searchFormId,
  filters,
  openMoreFiltersButtonRef,
  hasNoResults,
}) => {
  const router = useRouter();
  const [wrapperWidth, setWrapperWidth] = useState<number>(0);
  const [hasCalculatedFilters, setHasCalculatedFilters] = useState(false);
  const [dynamicFilters, setDynamicFilters] = useState<Filter[]>([]);

  const updateWrapperWidth = () => {
    if (wrapperRef.current) {
      const { width, left } = wrapperRef.current.getBoundingClientRect();
      setHasCalculatedFilters(false);
      setWrapperWidth(left + width);
    }
  };
  useEffect(() => {
    window.addEventListener('resize', updateWrapperWidth);
    updateWrapperWidth();
    return () => window.removeEventListener('resize', updateWrapperWidth);
  }, []);

  const filterClassname = 'superUniqueDropdownFilterButtonClass';
  const renderDynamicFilter = (f: Filter, i: number, arr: Filter[]) => {
    return (
      <Space
        key={f.id}
        className={filterClassname}
        h={
          i + 1 !== arr.length
            ? {
                size: 'm',
                properties: ['margin-right'],
              }
            : undefined
        }
      >
        {f.type === 'checkbox' && (
          <CheckboxFilter
            {...(!showMoreFiltersModal && { form: searchFormId })}
            f={f}
            changeHandler={changeHandler}
            isNewStyle={isNewStyle}
          />
        )}

        {f.type === 'dateRange' && (
          <DesktopDateRangeFilter
            {...(!showMoreFiltersModal && { form: searchFormId })}
            f={f}
            changeHandler={changeHandler}
            isNewStyle={isNewStyle}
            hasNoOptions={hasNoResults && !(f.from.value || f.to.value)}
          />
        )}

        {f.type === 'color' && (
          <DesktopColorFilter
            {...(!showMoreFiltersModal && { form: searchFormId })}
            f={f}
            changeHandler={changeHandler}
            isNewStyle={isNewStyle}
            hasNoOptions={hasNoResults && !f.color}
          />
        )}
      </Space>
    );
  };

  const dynamicFiltersSource = filters
    .filter(f => !f.excludeFromMoreFilters)
    .map(renderDynamicFilter);
  const dynamicFiltersCalculated = dynamicFilters
    .filter(f => !f.excludeFromMoreFilters)
    .map(renderDynamicFilter);

  /**
   * if you don't set this to false, then on route change, you don't get the
   * full filter list rendered before useLayoutEffect runs, which will have
   * `arrOfDropdownButtonNodes` count the dynamic list, which is not what we
   * want, and can result in smaller screens rendering out the entire filter
   * list
   */
  useEffect(() => {
    setHasCalculatedFilters(false);
  }, [router.query]);
  useLayoutEffect(() => {
    if (isNewStyle && !hasCalculatedFilters) {
      const arrOfDropdownButtonNodes = document.querySelectorAll(
        `.${filterClassname}`
      );

      const showAllFiltersModalButtonWidthInPixels = 150;
      const availableSpace =
        wrapperWidth - showAllFiltersModalButtonWidthInPixels;
      let dynamicFilterArray: Filter[] = [];
      /**
       * running a for loop in reverse, so that we start at the last item
       * and go backwards until one of the nodes fit, then all nodes
       * following should fit
       */
      for (let i = arrOfDropdownButtonNodes.length - 1; i >= 0; i--) {
        const dropdownButtonNode = arrOfDropdownButtonNodes[i];
        const { width, left } = dropdownButtonNode.getBoundingClientRect();
        const rightmostEdge = width + left;
        if (i === arrOfDropdownButtonNodes.length - 1) {
          if (rightmostEdge < wrapperWidth) {
            /**
             * If the right edge of the first element is inside the right edge
             * of the wrapper surrounding the elements, then all items will fit
             */
            dynamicFilterArray = [...filters];
            break;
          }
        }

        /**
         * If we are still in the loop, this means that the nodes do not
         * all fit inside of the wrapper, okay, let us see how many of
         * them do fit!
         */
        if (rightmostEdge < availableSpace) {
          /**
           * checking to see which node is within not just the wrapper
           * but also gives enough space for the `showModal` button
           */
          dynamicFilterArray = filters.slice(0, i + 1);
          break;
        }
      }
      setDynamicFilters(dynamicFilterArray);
      setHasCalculatedFilters(true);
    }
  }, [wrapperWidth, hasCalculatedFilters, router.query]);

  return (
    <>
      {hasCalculatedFilters ? dynamicFiltersCalculated : dynamicFiltersSource}
      {dynamicFilters.length < filters.length && (
        <Space
          h={{
            size: 'm',
            properties: ['padding-left', 'padding-right'],
          }}
        >
          <ButtonSolid
            colors={themeValues.buttonColors.marbleWhiteCharcoal}
            icon={filter}
            isIconAfter
            hoverUnderline={true}
            size="small"
            type={ButtonTypes.button}
            text="All Filters"
            clickHandler={event => {
              event.preventDefault();
              setShowMoreFiltersModal(true);
            }}
            ref={openMoreFiltersButtonRef}
            isPill
          />
        </Space>
      )}
    </>
  );
};

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
  const [showMoreFiltersModal, setShowMoreFiltersModal] = useState(false);
  const wrapperRef = useRef<HTMLDivElement>(null);
  const [isComponentMounted, setIsComponentMounted] = useState(false);
  useEffect(() => setIsComponentMounted(true), []);
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
            isComponentMounted={isComponentMounted}
          >
            {isNewStyle && (
              <>
                {isComponentMounted && (
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
                  {...(showMoreFiltersModal && { form: searchFormId })}
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
                      key={f.id}
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
                          f={f}
                          changeHandler={changeHandler}
                          form={searchFormId}
                          isNewStyle={isNewStyle}
                        />
                      )}
                    </Space>
                  );
                })}

                {modalFilters.length > 0 && (
                  <Space h={{ size: 's', properties: ['margin-left'] }}>
                    {isComponentMounted && (
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
