// @flow

import { useState, useRef, useEffect } from 'react';
import useFocusTrap from '../../../hooks/useFocusTrap';
import { CSSTransition } from 'react-transition-group';
import getFocusableElements from '../../../utils/get-focusable-elements';
import NextLink from 'next/link';
import { worksLink } from '../../../services/catalogue/routes';
import styled from 'styled-components';
import { classNames } from '../../../utils/classnames';
import Space from '../styled/Space';
import Icon from '../Icon/Icon';
import NumberInput from '@weco/common/views/components/NumberInput/NumberInput';
// $FlowFixMe (tsx)
import CheckboxRadio from '@weco/common/views/components/CheckboxRadio/CheckboxRadio';
import { type SearchFiltersSharedProps } from './SearchFilters';
import ButtonSolid, {
  SolidButton,
  // $FlowFixMe (tsx)
} from '@weco/common/views/components/ButtonSolid/ButtonSolid';

const ShameButtonWrap = styled(Space).attrs({
  v: { size: 'm', properties: ['padding-top', 'padding-bottom'] },
})`
  button {
    width: 100%;
    justify-content: center;
  }
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

const ActiveFilters = styled(Space).attrs({
  h: {
    size: 'xs',
    properties: ['margin-left', 'padding-left', 'padding-right'],
  },
  v: { size: 'xs', properties: ['padding-top', 'padding-bottom'] },
  className: classNames({
    'bg-yellow font-black inline-block rounded-corners text-align-center': true,
  }),
})`
  min-width: 24px;
`;

const FiltersBody = styled(Space).attrs({
  h: { size: 'xl', properties: ['padding-left', 'padding-right'] },
})`
  input[type='number'] {
    min-width: calc(24px + 4ch);
  }
`;

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
  worksRouteProps,
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

  const showWorkTypeFilters =
    workTypeFilters.some(f => f.count > 0) || workTypeInUrlArray.length > 0;

  const activeFiltersCount =
    workTypeInUrlArray.length +
    (productionDatesFrom ? 1 : 0) +
    (productionDatesTo ? 1 : 0);

  return (
    <Space v={{ size: 'l', properties: ['margin-top', 'margin-bottom'] }}>
      <ShameButtonWrap>
        <SolidButton
          ref={openFiltersButtonRef}
          onClick={handleOpenFiltersButtonClick}
          aria-controls="mobile-filters-modal"
          aria-label="open filters"
        >
          <Space h={{ size: 's', properties: ['margin-right'] }}>
            <Icon name="filter" />
          </Space>
          Filters{' '}
          {activeFiltersCount > 0 && ' ' && (
            <ActiveFilters>{activeFiltersCount}</ActiveFilters>
          )}
        </SolidButton>
      </ShameButtonWrap>
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
              {showWorkTypeFilters && (
                <FilterSection>
                  <h3 className="h3">Formats</h3>
                  <ul
                    className={classNames({
                      'no-margin no-padding plain-list': true,
                    })}
                  >
                    {workTypeFilters.map(workType => {
                      const isChecked = workTypeInUrlArray.includes(
                        workType.data.id
                      );

                      return (
                        (workType.count > 0 || isChecked) && (
                          <Space
                            as="li"
                            v={{ size: 'l', properties: ['margin-bottom'] }}
                            key={`mobile-${workType.data.id}`}
                          >
                            <CheckboxRadio
                              id={`mobile-${workType.data.id}`}
                              type={`checkbox`}
                              text={`${workType.data.label} (${workType.count})`}
                              value={workType.data.id}
                              name={`workType`}
                              checked={isChecked}
                              onChange={changeHandler}
                            />
                          </Space>
                        )
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
              ref={okFiltersButtonRef}
              type="button"
              clickHandler={handleOkFiltersButtonClick}
              text="OK"
            />
          </FiltersFooter>
        </FiltersModal>
      </CSSTransition>
    </Space>
  );
};

export default SearchFiltersMobile;
