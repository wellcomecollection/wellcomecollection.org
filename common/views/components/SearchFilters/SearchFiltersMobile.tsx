import React, {
  useState,
  useRef,
  FunctionComponent,
  ReactElement,
} from 'react';
import dynamic from 'next/dynamic';
import NextLink from 'next/link';
import styled from 'styled-components';

import useSkipInitialEffect from '@weco/common/hooks/useSkipInitialEffect';
import getFocusableElements from '@weco/common/utils/get-focusable-elements';
import { useControlledState } from '@weco/common/utils/useControlledState';
import PlainList from '@weco/common/views/components/styled/PlainList';
import Space from '@weco/common/views/components/styled/Space';
import Icon from '@weco/common/views/components/Icon/Icon';
import NumberInput from '@weco/common/views/components/NumberInput/NumberInput';
import CheckboxRadio from '@weco/common/views/components/CheckboxRadio/CheckboxRadio';
import { SearchFiltersSharedProps } from '@weco/common/views/components/SearchFilters/SearchFilters';
import {
  CheckboxFilter as CheckboxFilterType,
  DateRangeFilter as DateRangeFilterType,
  ColorFilter as ColorFilterType,
  filterLabel,
} from '@weco/common/services/catalogue/filters';
import ButtonSolid, {
  ButtonTypes,
  SolidButton,
} from '@weco/common/views/components/ButtonSolid/ButtonSolid';
import { searchFilterCheckBox } from '@weco/common/text/aria-labels';
import { filter } from '@weco/common/icons';
import Modal from '@weco/common/views/components/Modal/Modal';
import { dateRegex } from './SearchFiltersDesktop';

const PaletteColorPicker = dynamic(
  import('../PaletteColorPicker/PaletteColorPicker')
);

const SearchFiltersContainer = styled(Space).attrs({
  v: { size: 'm', properties: ['padding-top', 'padding-bottom'] },
})`
  background-color: ${props => props.theme.color('white')};
`;

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
})`
  border-bottom: 1px solid ${props => props.theme.color('warmNeutral.400')};
  text-align: center;
`;

const ActiveFilters = styled(Space).attrs({
  h: {
    size: 'xs',
    properties: ['margin-left', 'padding-left', 'padding-right'],
  },
  v: { size: 'xs', properties: ['padding-top', 'padding-bottom'] },
  className: 'rounded-corners',
})`
  display: inline-block;
  color: ${props => props.theme.color('black')};
  background-color: ${props => props.theme.color('yellow')};
  text-align: center;
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
})`
  border-bottom: 1px solid ${props => props.theme.color('warmNeutral.400')};
`;

const FiltersScrollable = styled.div`
  position: absolute;
  width: 100%;
  height: calc(100% - 60px);
  overflow: auto;
`;

const FiltersFooter = styled(Space).attrs({
  h: { size: 'xl', properties: ['padding-left', 'padding-right'] },
  v: { size: 'xl', properties: ['padding-top', 'padding-bottom'] },
})`
  display: flex;
  align-items: center;
  justify-content: space-between;
  background-color: ${props => props.theme.color('white')};
  border-top: 1px solid ${props => props.theme.color('warmNeutral.400')};
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  height: 60px;
`;

type CheckboxFilterProps = {
  f: CheckboxFilterType;
  changeHandler: () => void;
  form?: string;
};
const CheckboxFilter = ({ f, changeHandler, form }: CheckboxFilterProps) => {
  return (
    <>
      <PlainList>
        {f.options.map(({ id, label, value, count, selected }) => {
          return (
            <Space
              as="li"
              v={{ size: 'l', properties: ['margin-bottom'] }}
              key={`mobile-${id}`}
            >
              <CheckboxRadio
                id={`mobile-${id}`}
                type="checkbox"
                text={filterLabel({ label, count })}
                value={value}
                name={f.id}
                checked={selected}
                onChange={changeHandler}
                ariaLabel={searchFilterCheckBox(label)}
                form={form}
              />
            </Space>
          );
        })}
      </PlainList>
    </>
  );
};

type DateRangeFilterProps = {
  f: DateRangeFilterType;
  changeHandler: () => void;
  form?: string;
};
const DateRangeFilter = ({ f, changeHandler, form }: DateRangeFilterProps) => {
  const [from, setFrom] = useControlledState(f.from.value);
  const [to, setTo] = useControlledState(f.to.value);

  return (
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
  );
};

type ColorFilterProps = {
  f: ColorFilterType;
  changeHandler: () => void;
  form?: string;
};
const ColorFilter = ({ f, changeHandler, form }: ColorFilterProps) => {
  return (
    <PaletteColorPicker
      color={f.color}
      name={f.id}
      onChangeColor={changeHandler}
      form={form}
    />
  );
};

const SearchFiltersMobile: FunctionComponent<SearchFiltersSharedProps> = ({
  query,
  changeHandler,
  linkResolver,
  filters,
  activeFiltersCount,
  searchFormId,
  hasNoResults,
}: SearchFiltersSharedProps): ReactElement<SearchFiltersSharedProps> => {
  const openFiltersButtonRef = useRef<HTMLButtonElement>(null);
  const closeFiltersButtonRef = useRef<HTMLDivElement>(null);
  const okFiltersButtonRef = useRef<HTMLButtonElement>(null);
  const filtersModalRef = useRef<HTMLDivElement>(null);
  const [isActive, setIsActive] = useState(false);

  useSkipInitialEffect(() => {
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
      getFocusableElements<HTMLDivElement>(filtersModalRef.current);

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
    <SearchFiltersContainer>
      <ShameButtonWrap>
        <SolidButton
          type={ButtonTypes.button}
          ref={openFiltersButtonRef}
          onClick={handleOpenFiltersButtonClick}
          aria-controls="mobile-filters-modal"
          aria-label="open filters"
        >
          <Space h={{ size: 's', properties: ['margin-right'] }}>
            <Icon icon={filter} />
          </Space>
          Filters{' '}
          {activeFiltersCount > 0 && ' ' && (
            <ActiveFilters>{activeFiltersCount}</ActiveFilters>
          )}
        </SolidButton>
      </ShameButtonWrap>
      <Modal
        id="mobile-filters-modal"
        isActive={isActive}
        setIsActive={setIsActive}
        openButtonRef={openFiltersButtonRef}
        modalStyle="filters"
      >
        <FiltersScrollable>
          <FiltersHeader>
            <h2 className="h2">Filters</h2>
          </FiltersHeader>

          <FiltersBody>
            {filters
              .filter(f => !f.excludeFromMoreFilters)
              .map(f => {
                return (
                  <FilterSection key={f.id}>
                    <h3 className="h3">
                      {f.type === 'color' ? 'Colours' : f.label}
                    </h3>
                    {f.type === 'checkbox' && (
                      <CheckboxFilter
                        f={f}
                        changeHandler={changeHandler}
                        form={searchFormId}
                      />
                    )}

                    {f.type === 'dateRange' &&
                      !(hasNoResults && !(f.from.value || f.to.value)) && (
                        <DateRangeFilter
                          f={f}
                          changeHandler={changeHandler}
                          form={searchFormId}
                        />
                      )}

                    {f.type === 'color' && !(hasNoResults && !f.color) && (
                      <ColorFilter
                        f={f}
                        changeHandler={changeHandler}
                        form={searchFormId}
                      />
                    )}
                  </FilterSection>
                );
              })}
          </FiltersBody>
        </FiltersScrollable>

        <FiltersFooter>
<<<<<<< HEAD
          <NextLink passHref {...linkResolver({ query })}>
            Reset filters
=======
          <NextLink
            passHref
            {...worksLink(
              {
                ...(query && { query }),
              },
              'cancel_filter/all'
            )}
          >
            <a>Reset filters</a>
>>>>>>> main
          </NextLink>

          <ButtonSolid
            ref={okFiltersButtonRef}
            type={ButtonTypes.button}
            clickHandler={handleOkFiltersButtonClick}
            text="Show results"
          />
        </FiltersFooter>
      </Modal>
    </SearchFiltersContainer>
  );
};

export default SearchFiltersMobile;
