import React, {
  useState,
  useRef,
  useEffect,
  FunctionComponent,
  ReactElement,
} from 'react';
import dynamic from 'next/dynamic';
import useFocusTrap from '../../../hooks/useFocusTrap';
import { CSSTransition } from 'react-transition-group';
import getFocusableElements from '../../../utils/get-focusable-elements';
import { useControlledState } from '../../../utils/useControlledState';
import NextLink from 'next/link';
import { toLink as worksLink } from '../WorksLink/WorksLink';
import styled from 'styled-components';
import { classNames } from '../../../utils/classnames';
import Space from '../styled/Space';
import Icon from '../Icon/Icon';
import NumberInput from '@weco/common/views/components/NumberInput/NumberInput';
import CheckboxRadio from '@weco/common/views/components/CheckboxRadio/CheckboxRadio';
import { SearchFiltersSharedProps } from '../SearchFilters/SearchFilters';
import {
  CheckboxFilter as CheckboxFilterType,
  DateRangeFilter as DateRangeFilterType,
  ColorFilter as ColorFilterType,
} from '../../../services/catalogue/filters';
import ButtonSolid, {
  ButtonTypes,
  SolidButton,
} from '@weco/common/views/components/ButtonSolid/ButtonSolid';
import {
  searchFilterCheckBox,
  searchFilterCloseButton,
} from '../../../text/aria-labels';

const PaletteColorPicker = dynamic(
  import('../PaletteColorPicker/PaletteColorPicker')
);

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
  'aria-label': searchFilterCloseButton,
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

type CheckboxFilterProps = {
  f: CheckboxFilterType;
  changeHandler: () => void;
};
const CheckboxFilter = ({ f, changeHandler }: CheckboxFilterProps) => {
  return (
    <>
      <h3 className="h3">{f.label}</h3>
      <ul
        className={classNames({
          'no-margin no-padding plain-list': true,
        })}
      >
        {f.options.map(({ id, label, value, count, selected }) => {
          return (
            <Space
              as="li"
              v={{ size: 'l', properties: ['margin-bottom'] }}
              key={`mobile-${id}`}
            >
              <CheckboxRadio
                id={`mobile-${id}`}
                type={`checkbox`}
                text={`${label} (${count})`}
                value={value}
                name={f.id}
                checked={selected}
                onChange={changeHandler}
                ariaLabel={searchFilterCheckBox(label)}
              />
            </Space>
          );
        })}
      </ul>
    </>
  );
};

type DateRangeFilterProps = {
  f: DateRangeFilterType;
  changeHandler: () => void;
};
const DateRangeFilter = ({ f, changeHandler }: DateRangeFilterProps) => {
  const [from, setFrom] = useControlledState(f.from.value);
  const [to, setTo] = useControlledState(f.to.value);

  return (
    <>
      <h3 className="h3">{f.label}</h3>
      <Space as="span" h={{ size: 'm', properties: ['margin-right'] }}>
        <NumberInput
          name={f.from.id}
          label="From"
          min="0"
          max="9999"
          placeholder={'Year'}
          value={from || ''}
          onChange={event => {
            const val = `${event.currentTarget.value}`;
            setFrom(val);
            if (val.match(/^\d{4}$/)) {
              changeHandler();
            }
          }}
        />
      </Space>
      <NumberInput
        name={f.to.id}
        label="to"
        min="0"
        max="9999"
        placeholder={'Year'}
        value={to || ''}
        onChange={event => {
          const val = `${event.currentTarget.value}`;
          setTo(val);
          if (val.match(/^\d{4}$/)) {
            changeHandler();
          }
        }}
      />
    </>
  );
};

type ColorFilterProps = {
  f: ColorFilterType;
  changeHandler: () => void;
};
const ColorFilter = ({ f, changeHandler }: ColorFilterProps) => {
  return (
    <PaletteColorPicker
      color={f.color}
      name={f.id}
      onChangeColor={changeHandler}
    />
  );
};

const SearchFiltersMobile: FunctionComponent<SearchFiltersSharedProps> = ({
  query,
  changeHandler,
  filters,
  activeFiltersCount,
}: SearchFiltersSharedProps): ReactElement<SearchFiltersSharedProps> => {
  const openFiltersButtonRef = useRef<HTMLButtonElement>(null);
  const closeFiltersButtonRef = useRef<HTMLDivElement>(null);
  const okFiltersButtonRef = useRef<HTMLButtonElement>(null);
  const filtersModalRef = useRef<HTMLDivElement>(null);
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
    <Space
      v={{ size: 'm', properties: ['padding-top', 'padding-bottom'] }}
      className={classNames({ 'bg-white': true })}
    >
      <ShameButtonWrap>
        <SolidButton
          type={ButtonTypes.button}
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
        <FiltersModal ref={filtersModalRef}>
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
              {filters.map(f => {
                return (
                  <FilterSection key={f.id}>
                    {f.type === 'checkbox' && (
                      <CheckboxFilter f={f} changeHandler={changeHandler} />
                    )}

                    {f.type === 'dateRange' && (
                      <DateRangeFilter f={f} changeHandler={changeHandler} />
                    )}

                    {f.type === 'color' && (
                      <ColorFilter f={f} changeHandler={changeHandler} />
                    )}
                  </FilterSection>
                );
              })}
            </FiltersBody>
          </FiltersScrollable>

          <FiltersFooter>
            <NextLink
              passHref
              {...worksLink(
                {
                  query: query,
                },
                'cancel_filter/all'
              )}
            >
              <a>Reset filters</a>
            </NextLink>

            <ButtonSolid
              ref={okFiltersButtonRef}
              type={ButtonTypes.button}
              clickHandler={handleOkFiltersButtonClick}
              text="Show results"
            />
          </FiltersFooter>
        </FiltersModal>
      </CSSTransition>
    </Space>
  );
};

export default SearchFiltersMobile;
