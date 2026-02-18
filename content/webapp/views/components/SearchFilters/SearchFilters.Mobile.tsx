import NextLink from 'next/link';
import { FunctionComponent, ReactElement, useRef, useState } from 'react';
import styled from 'styled-components';

import { filter } from '@weco/common/icons';
import { font } from '@weco/common/utils/classnames';
import getFocusableElements from '@weco/common/utils/get-focusable-elements';
import Button, {
  ButtonTypes,
  StyledButton,
} from '@weco/common/views/components/Buttons';
import CheckboxRadio from '@weco/common/views/components/CheckboxRadio';
import Icon from '@weco/common/views/components/Icon';
import Modal from '@weco/common/views/components/Modal';
import PlainList from '@weco/common/views/components/styled/PlainList';
import Space from '@weco/common/views/components/styled/Space';
import useSkipInitialEffect from '@weco/content/hooks/useSkipInitialEffect';
import {
  CheckboxFilter as CheckboxFilterType,
  filterLabel,
  RadioFilter as RadioFilterType,
} from '@weco/content/services/wellcome/common/filters';
import { searchFilterCheckBox } from '@weco/content/text/aria-labels';
import PaletteColorPicker from '@weco/content/views/components/PaletteColorPicker';

import { SearchFiltersSharedProps } from '.';
import { BooleanFilter } from './SearchFilters.BooleanFilter';
import DateRangeFilter from './SearchFilters.DateRangeFilter';
import { getFilterLabel } from './SearchFilters.Desktop.Modal';

const SearchFiltersContainer = styled(Space).attrs({
  $v: { size: 'sm', properties: ['padding-top', 'padding-bottom'] },
})`
  background-color: ${props => props.theme.color('white')};
`;

const ShameButtonWrap = styled(Space).attrs({
  $v: { size: 'sm', properties: ['padding-top', 'padding-bottom'] },
})`
  button {
    width: 100%;
    justify-content: center;
  }
`;

const FiltersHeader = styled(Space).attrs({
  $h: { size: 'sm', properties: ['padding-left', 'padding-right'] },
  $v: { size: 'md', properties: ['padding-top', 'padding-bottom'] },
})`
  border-bottom: 1px solid ${props => props.theme.color('warmNeutral.400')};
  text-align: center;
`;

const ActiveFilters = styled(Space).attrs({
  $h: {
    size: 'xs',
    properties: ['margin-left', 'padding-left', 'padding-right'],
  },
  $v: { size: 'xs', properties: ['padding-top', 'padding-bottom'] },
})`
  display: inline-block;
  color: ${props => props.theme.color('black')};
  background-color: ${props => props.theme.color('yellow')};
  text-align: center;
  min-width: 24px;
  border-radius: ${props => props.theme.borderRadiusUnit}px;
`;

const FiltersBody = styled(Space).attrs({
  $h: { size: 'xl', properties: ['padding-left', 'padding-right'] },
  $v: { size: 'xl', properties: ['padding-bottom'] },
})`
  input[type='number'] {
    min-width: calc(24px + 4ch);
  }
`;

const FilterSection = styled(Space).attrs({
  $v: { size: 'xl', properties: ['padding-top', 'padding-bottom'] },
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
  $h: { size: 'xl', properties: ['padding-left', 'padding-right'] },
  $v: { size: 'xl', properties: ['padding-top', 'padding-bottom'] },
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
    <PlainList>
      {f.options.map(({ id, label, value, count, selected }) => {
        return (
          <Space
            as="li"
            $v={{ size: 'md', properties: ['margin-bottom'] }}
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
  );
};

type RadioFilterProps = {
  f: RadioFilterType;
  changeHandler: () => void;
  form?: string;
};
const RadioFilter = ({ f, changeHandler, form }: RadioFilterProps) => {
  return (
    <PlainList>
      {f.options.map(({ id, label, value, count, selected }) => {
        return (
          <Space
            as="li"
            $v={{ size: 'md', properties: ['margin-bottom'] }}
            key={`mobile-${id}`}
          >
            <CheckboxRadio
              id={`mobile-${id}`}
              type="radio"
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
    const focusables =
      filtersModalRef &&
      filtersModalRef.current &&
      getFocusableElements<HTMLDivElement>(filtersModalRef.current);

    if (isActive) {
      focusables &&
        focusables.forEach(focusable => focusable.removeAttribute('tabIndex'));
      const firstFocusable = focusables && focusables[0];

      firstFocusable && firstFocusable.focus();
    } else {
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
    <SearchFiltersContainer data-lock-scroll={isActive}>
      <ShameButtonWrap>
        <StyledButton
          type={ButtonTypes.button}
          ref={openFiltersButtonRef}
          onClick={handleOpenFiltersButtonClick}
          aria-controls="mobile-filters-modal"
          aria-label="open filters"
        >
          <Space $h={{ size: 'xs', properties: ['margin-right'] }}>
            <Icon icon={filter} />
          </Space>
          Filters{' '}
          {activeFiltersCount > 0 && ' ' && (
            <ActiveFilters>{activeFiltersCount}</ActiveFilters>
          )}
        </StyledButton>
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
            <h2 className={font('brand-bold', 1)}>Filters</h2>
          </FiltersHeader>

          <FiltersBody>
            {filters.map(f => {
              // We need to have the excluded filters still in the form so their values gets retained in the URL
              // when more filtering is done (e.g. partOf.title)
              // Only checkbox types are excluded at the moment
              return f.excludeFromMoreFilters && f.type === 'checkbox' ? (
                <div className="is-hidden">
                  <CheckboxFilter
                    f={f}
                    changeHandler={changeHandler}
                    form={searchFormId}
                  />
                </div>
              ) : (
                <FilterSection key={f.id}>
                  {getFilterLabel(f.type, f.label)}

                  {f.type === 'checkbox' && (
                    <CheckboxFilter
                      f={f}
                      changeHandler={changeHandler}
                      form={searchFormId}
                    />
                  )}

                  {f.type === 'radio' && (
                    <RadioFilter
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
                    <PaletteColorPicker
                      name={f.id}
                      color={f.color}
                      onChangeColor={changeHandler}
                      form={searchFormId}
                    />
                  )}

                  {f.type === 'boolean' && !(hasNoResults && !f.isSelected) && (
                    <BooleanFilter
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
          <NextLink {...linkResolver({ query })}>Reset filters</NextLink>

          <Button
            variant="ButtonSolid"
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
