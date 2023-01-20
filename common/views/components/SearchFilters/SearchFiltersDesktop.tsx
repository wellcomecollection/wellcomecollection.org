import React, {
  FunctionComponent,
  ReactElement,
  useEffect,
  useRef,
  useState,
  useLayoutEffect,
} from 'react';
import styled from 'styled-components';
import { font } from '../../../utils/classnames';
import { useControlledState } from '../../../utils/useControlledState';
import PlainList from '../styled/PlainList';
import Space from '../styled/Space';
import Icon from '../Icon/Icon';
import DropdownButton from '@weco/common/views/components/DropdownButton/DropdownButton';
import NumberInput from '@weco/common/views/components/NumberInput/NumberInput';
import CheckboxRadio from '@weco/common/views/components/CheckboxRadio/CheckboxRadio';
import { SearchFiltersSharedProps } from '../SearchFilters/SearchFilters';
import {
  CheckboxFilter as CheckboxFilterType,
  DateRangeFilter as DateRangeFilterType,
  ColorFilter as ColorFilterType,
  filterLabel,
  Filter,
} from '../../../services/catalogue/filters';
import ModalMoreFilters from '../ModalMoreFilters/ModalMoreFilters';
import { ResetActiveFilters } from './ResetActiveFilters';
import ButtonSolid, { ButtonTypes } from '../ButtonSolid/ButtonSolid';
import { filter } from '@weco/common/icons';
import { themeValues } from '@weco/common/views/themes/config';
import PaletteColorPicker from '../PaletteColorPicker/PaletteColorPicker';
import { useRouter } from 'next/router';

export const dateRegex = /^\d{4}$|^$/;

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
        <ul className={`no-margin no-padding plain-list ${font('intr', 5)}`}>
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
        </ul>
      </PlainList>
    </DropdownButton>
  );
};

type DateRangeFilterProps = {
  f: DateRangeFilterType;
  changeHandler: () => void;
  form?: string;
  isNewStyle?: boolean;
};

const DateRangeFilter = ({
  f,
  changeHandler,
  form,
  isNewStyle,
}: DateRangeFilterProps) => {
  const [from, setFrom] = useControlledState(f.from.value);
  const [to, setTo] = useControlledState(f.to.value);

  return (
    <Space className={font('intr', 5)}>
      <DropdownButton
        isPill={isNewStyle}
        isFilter
        label={f.label}
        buttonType="inline"
        id={f.id}
      >
        <>
          <Space as="span" h={{ size: 'm', properties: ['margin-right'] }}>
            <NumberInput
              name={f.from.id}
              label="From"
              min="0"
              max="9999"
              placeholder="Year"
              value={from || ''}
              onChange={event => {
                const val = `${event.currentTarget.value}`;
                setFrom(val);
                if (val.match(dateRegex)) {
                  changeHandler();
                }
              }}
              form={form}
            />
          </Space>
          <NumberInput
            name={f.to.id}
            label="to"
            min="0"
            max="9999"
            placeholder="Year"
            value={to || ''}
            onChange={event => {
              const val = `${event.currentTarget.value}`;
              setTo(val);
              if (val.match(dateRegex)) {
                changeHandler();
              }
            }}
            form={form}
          />
        </>
      </DropdownButton>
    </Space>
  );
};

type ColorFilterProps = {
  f: ColorFilterType;
  changeHandler: () => void;
  form?: string;
  isNewStyle?: boolean;
};
const ColorFilter = ({
  f,
  changeHandler,
  form,
  isNewStyle,
}: ColorFilterProps) => {
  return (
    <DropdownButton
      isPill={isNewStyle}
      isFilter
      label="Colours"
      buttonType="inline"
      id="images.color"
    >
      <PaletteColorPicker
        name={f.id}
        color={f.color}
        onChangeColor={changeHandler}
        form={form}
      />
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
    if (isNewStyle) {
      window.addEventListener('resize', updateWrapperWidth);
      updateWrapperWidth();
      return () => window.removeEventListener('resize', updateWrapperWidth);
    }
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
                size: isNewStyle ? 'm' : 's',
                properties: ['margin-right'],
              }
            : undefined
        }
      >
        {f.type === 'checkbox' && (
          <CheckboxFilter
            f={f}
            changeHandler={changeHandler}
            form={showMoreFiltersModal ? undefined : searchFormId}
            isNewStyle={isNewStyle}
          />
        )}

        {f.type === 'dateRange' && (
          <DateRangeFilter
            f={f}
            changeHandler={changeHandler}
            form={showMoreFiltersModal ? undefined : searchFormId}
            isNewStyle={isNewStyle}
          />
        )}

        {f.type === 'color' && (
          <ColorFilter
            f={f}
            changeHandler={changeHandler}
            form={showMoreFiltersModal ? undefined : searchFormId}
            isNewStyle={isNewStyle}
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
}: SearchFiltersSharedProps): ReactElement<SearchFiltersSharedProps> => {
  const [showMoreFiltersModal, setShowMoreFiltersModal] = useState(false);
  const wrapperRef = useRef<HTMLDivElement>(null);
  const [componentMounted, setComponentMounted] = useState(false);
  useEffect(() => setComponentMounted(true), []);
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
          <Space
            v={{ size: 'm', properties: ['margin-bottom'] }}
            className={`flex flex--v-center flex--${
              componentMounted ? 'no-' : ''
            }wrap`}
          >
            {isNewStyle && (
              <>
                {componentMounted && (
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
                  />
                )}
                <ModalMoreFilters
                  id="moreFilters"
                  isActive={showMoreFiltersModal}
                  setIsActive={setShowMoreFiltersModal}
                  openMoreFiltersButtonRef={openMoreFiltersButtonRef}
                  changeHandler={changeHandler}
                  resetFilters={linkResolver({ query })}
                  filters={filters}
                  form={searchFormId}
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
                          ? {
                              size: isNewStyle ? 'm' : 's',
                              properties: ['margin-right'],
                            }
                          : undefined
                      }
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
                        <DateRangeFilter
                          f={f}
                          changeHandler={changeHandler}
                          form={searchFormId}
                          isNewStyle={isNewStyle}
                        />
                      )}

                      {f.type === 'color' && (
                        <ColorFilter
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
                  <Space
                    className={font('intr', 5)}
                    h={{
                      size: isNewStyle ? 'm' : 's',
                      properties: ['margin-left'],
                    }}
                  >
                    {componentMounted && (
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
          </Space>
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
