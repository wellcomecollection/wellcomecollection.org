import React, { useEffect, useState, useLayoutEffect } from 'react';
import { useRouter } from 'next/router';

import ButtonSolid, {
  ButtonTypes,
} from '@weco/common/views/components/ButtonSolid/ButtonSolid';
import { themeValues } from '@weco/common/views/themes/config';
import { Filter } from '@weco/catalogue/services/wellcome/catalogue/filters';
import Space from '@weco/common/views/components/styled/Space';
import { filter } from '@weco/common/icons';

import CheckboxFilter from './SearchFilters.Desktop.CheckboxFilter';
import DesktopDateRangeFilter from './SearchFilters.Desktop.DateRangeFilter';
import DesktopColorFilter from './SearchFilters.Desktop.ColorFilter';

const DynamicFilterArray = ({
  showMoreFiltersModal,
  setShowMoreFiltersModal,
  wrapperRef,
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

  const renderDynamicFilter = (f: Filter, i: number, arr: Filter[]) => {
    // We need to have the excluded filters still in the form so their values gets retained in the URL
    // when more filtering is done (e.g. partOf.title)
    // Only checkbox types are excluded at the moment
    return f.excludeFromMoreFilters && f.type === 'checkbox' ? (
      <div className="is-hidden">
        <CheckboxFilter
          {...(!showMoreFiltersModal && { form: searchFormId })}
          f={f}
          changeHandler={changeHandler}
        />
      </div>
    ) : (
      // TODO remove index from key once we resolve the doubled IDs issue
      // (https://github.com/wellcomecollection/wellcomecollection.org/issues/9109)
      // as we now sometimes get "Warning: Encountered two children with the same key" console errors
      <Space
        key={`${f.id}-${i}`}
        data-is-filter // Needed in useLayoutEffect
        h={
          i + 1 !== arr.length
            ? { size: 'm', properties: ['margin-right'] }
            : undefined
        }
      >
        {f.type === 'checkbox' && (
          <CheckboxFilter
            {...(!showMoreFiltersModal && { form: searchFormId })}
            f={f}
            changeHandler={changeHandler}
          />
        )}

        {f.type === 'dateRange' && (
          <DesktopDateRangeFilter
            {...(!showMoreFiltersModal && { form: searchFormId })}
            f={f}
            changeHandler={changeHandler}
            hasNoOptions={hasNoResults && !(f.from.value || f.to.value)}
          />
        )}

        {f.type === 'color' && (
          <DesktopColorFilter
            {...(!showMoreFiltersModal && { form: searchFormId })}
            name={f.id}
            color={f.color}
            onChangeColor={changeHandler}
            hasNoOptions={hasNoResults && !f.color}
          />
        )}
      </Space>
    );
  };

  const dynamicFiltersSource = filters.map(renderDynamicFilter);
  const dynamicFiltersCalculated = dynamicFilters.map(renderDynamicFilter);

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

  useEffect(() => {
    window.addEventListener('resize', updateWrapperWidth);
    updateWrapperWidth();
    return () => window.removeEventListener('resize', updateWrapperWidth);
  }, []);

  useLayoutEffect(() => {
    if (!hasCalculatedFilters) {
      const arrOfDropdownButtonNodes =
        document.querySelectorAll('[data-is-filter]');

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
          if (rightmostEdge < availableSpace) {
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
      <Space h={{ size: 'm', properties: ['padding-left', 'padding-right'] }}>
        <ButtonSolid
          colors={themeValues.buttonColors.marbleWhiteCharcoal}
          icon={filter}
          isIconAfter
          hoverUnderline={true}
          size="small"
          type={ButtonTypes.button}
          text="All filters"
          clickHandler={event => {
            event.preventDefault();
            setShowMoreFiltersModal(true);
          }}
          ref={openMoreFiltersButtonRef}
          isPill
        />
      </Space>
    </>
  );
};

export default DynamicFilterArray;