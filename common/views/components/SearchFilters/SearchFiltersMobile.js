// @flow

import { useState, useRef, useEffect } from 'react';
import useFocusTrap from '../../../hooks/useFocusTrap';
import { CSSTransition } from 'react-transition-group';
import getFocusableElements from '../../../utils/get-focusable-elements';
import NextLink from 'next/link';
import { worksLink } from '../../../services/catalogue/codecs';
import styled from 'styled-components';
import { classNames, font } from '../../../utils/classnames';
import Space from '../styled/Space';
import Icon from '../Icon/Icon';
import NumberInput from '@weco/common/views/components/NumberInput/NumberInput';
import Checkbox from '@weco/common/views/components/Checkbox/Checkbox';
import { type SearchFiltersSharedProps } from './SearchFilters';

const OpenFiltersButton = styled(Space).attrs({
  'aria-controls': 'mobile-filters-modal',
  'aria-label': 'open filters',
  v: { size: 'm', properties: ['padding-top', 'padding-bottom'] },
  as: 'button',
  type: 'button',
  className: classNames({
    'btn btn--primary': true,
    [font('hnm', 5)]: true,
  }),
})`
  width: 100%;
  display: block;
`;

const FiltersHeader = styled(Space).attrs({
  h: { size: 'm', properties: ['padding-left', 'padding-right'] },
  v: { size: 'l', properties: ['padding-top', 'padding-bottom'] },
  className: classNames({
    'border-color-pumice border-bottom-width-1 relative': true,
  }),
})``;

const CloseFiltersButton = styled(Space).attrs({
  h: { size: 'm', properties: ['left'] },
  as: 'button',
  type: 'button',
  className: classNames({
    'plain-button': true,
  }),
})`
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
`;

const FiltersModal = styled.div.attrs({
  'aria-modal': true,
  id: 'mobile-filters-modal',
  className: classNames({
    'bg-white': true,
  }),
})`
  position: fixed;
  top: 0;
  right: 0;
  left: 0;
  bottom: 0;
  transition: opacity 350ms ease, transform 350ms ease;

  &,
  &.fade-exit-done {
    z-index: -1;
    pointer-events: none;
  }

  &.fade-enter,
  &.fade-exit,
  &.fade-enter-done {
    z-index: 10;
    pointer-events: all;
  }

  &,
  &.fade-enter,
  &.fade-exit-active,
  &.fade-exit-done {
    opacity: 0;
    transform: scale(0.9);
  }

  &.fade-enter-active,
  &.fade-enter-done {
    opacity: 1;
    transform: scale(1);
  }
`;

const FiltersBody = styled(Space).attrs({
  h: { size: 'xl', properties: ['padding-left', 'padding-right'] },
})``;

const FilterSection = styled(Space).attrs({
  v: { size: 'xl', properties: ['padding-top', 'padding-bottom'] },
  className: classNames({
    'border-bottom-width-1 border-color-pumice': true,
  }),
})``;

const FiltersScrollable = styled.div.attrs({
  className: classNames({
    absolute: true,
  }),
})`
  width: 100%;
  height: calc(100% - 60px);
  overflow: auto;
`;

const FiltersFooter = styled(Space).attrs({
  h: { size: 'xl', properties: ['padding-left', 'padding-right'] },
  v: { size: 'xl', properties: ['padding-top', 'padding-bottom'] },
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

const SearchFiltersMobile = ({
  searchForm,
  worksParams,
  workTypeAggregations,
  changeHandler,
  inputDateFrom,
  inputDateTo,
  setInputDateFrom,
  setInputDateTo,
  workTypeFilters,
  productionDatesFrom,
  productionDatesTo,
  workTypeInUrlArray,
}: SearchFiltersSharedProps) => {
  const openFiltersButtonRef = useRef(null);
  const closeFiltersButtonRef = useRef(null);
  const okFiltersButtonRef = useRef(null);
  const filtersModalRef = useRef(null);
  const [isActive, setIsActive] = useState(false);

  useFocusTrap(closeFiltersButtonRef, okFiltersButtonRef);

  useEffect(() => {
    function setPageScrollLock(value) {
      if (document.documentElement) {
        if (value) {
          document.documentElement.classList.add('is-scroll-locked--to-medium');
        } else {
          document.documentElement.classList.remove(
            'is-scroll-locked--to-medium'
          );
        }
      }
    }

    const focusables =
      filtersModalRef &&
      filtersModalRef.current &&
      getFocusableElements(filtersModalRef.current);

    if (isActive) {
      setPageScrollLock(true);
      focusables &&
        focusables.forEach(focusable => focusable.removeAttribute('tabIndex'));
      const firstFocusable = focusables && focusables[0];

      firstFocusable && firstFocusable.focus();
    } else {
      setPageScrollLock(false);
      focusables &&
        focusables.forEach(focusable =>
          focusable.setAttribute('tabIndex', '-1')
        );

      openFiltersButtonRef &&
        openFiltersButtonRef.current &&
        openFiltersButtonRef.current.focus();
    }
  }, [isActive]);

  function handleOkFiltersButtonClick() {
    setIsActive(false);
  }

  function handleOpenFiltersButtonClick() {
    setIsActive(true);

    closeFiltersButtonRef &&
      closeFiltersButtonRef.current &&
      closeFiltersButtonRef.current.focus();
  }

  return (
    <Space v={{ size: 'l', properties: ['margin-top', 'margin-bottom'] }}>
      <OpenFiltersButton
        ref={openFiltersButtonRef}
        onClick={handleOpenFiltersButtonClick}
      >
        <Icon name="filter" />
        <Space as="span" h={{ size: 's', properties: ['margin-left'] }}>
          Filter
        </Space>
      </OpenFiltersButton>
      <CSSTransition in={isActive} classNames="fade" timeout={350}>
        <FiltersModal ref={filtersModalRef} isActive={isActive}>
          <FiltersScrollable>
            <FiltersHeader>
              <CloseFiltersButton
                ref={closeFiltersButtonRef}
                onClick={() => setIsActive(false)}
              >
                <Icon name="cross" />
                <span className="visually-hidden">close filters</span>
              </CloseFiltersButton>
              <h2 className="h3 text-align-center block">Filters</h2>
            </FiltersHeader>

            <FiltersBody>
              <FilterSection>
                <h3 className="h3">Dates</h3>
                <Space
                  as="span"
                  h={{ size: 'm', properties: ['margin-right'] }}
                >
                  <NumberInput
                    label="From"
                    min="0"
                    max="9999"
                    placeholder={'Year'}
                    name="production.dates.from"
                    value={inputDateFrom || ''}
                    onChange={event => {
                      setInputDateFrom(`${event.currentTarget.value}`);
                    }}
                  />
                </Space>
                <NumberInput
                  label="to"
                  min="0"
                  max="9999"
                  placeholder={'Year'}
                  name="production.dates.to"
                  value={inputDateTo || ''}
                  onChange={event => {
                    setInputDateTo(`${event.currentTarget.value}`);
                  }}
                />
              </FilterSection>
              {workTypeFilters.length > 0 && (
                <FilterSection>
                  <h3 className="h3">Formats</h3>
                  <ul
                    className={classNames({
                      'no-margin no-padding plain-list': true,
                    })}
                  >
                    {workTypeFilters.map(workType => {
                      return (
                        <Space
                          as="li"
                          v={{ size: 'l', properties: ['margin-bottom'] }}
                          key={`mobile-${workType.data.id}`}
                        >
                          <Checkbox
                            id={`mobile-${workType.data.id}`}
                            text={`${workType.data.label} (${workType.count})`}
                            value={workType.data.id}
                            name={`workType`}
                            checked={
                              workTypeInUrlArray &&
                              workTypeInUrlArray.includes(workType.data.id)
                            }
                            onChange={event => {
                              changeHandler();
                            }}
                          />
                        </Space>
                      );
                    })}
                  </ul>
                </FilterSection>
              )}
            </FiltersBody>
          </FiltersScrollable>

          <FiltersFooter>
            <NextLink
              passHref
              {...worksLink({
                ...worksParams,
                workType: null,
                page: 1,
                productionDatesFrom: null,
                productionDatesTo: null,
                itemsLocationsLocationType: null,
              })}
            >
              <a>Reset filters</a>
            </NextLink>
            <button
              ref={okFiltersButtonRef}
              type="button"
              className="btn btn--primary"
              onClick={handleOkFiltersButtonClick}
            >
              OK
            </button>
          </FiltersFooter>
        </FiltersModal>
      </CSSTransition>
    </Space>
  );
};

export default SearchFiltersMobile;
