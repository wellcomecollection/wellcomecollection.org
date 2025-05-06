import NextLink from 'next/link';
import { FunctionComponent, RefObject } from 'react';
import styled from 'styled-components';

import { useAppContext } from '@weco/common/contexts/AppContext';
import { LinkProps } from '@weco/common/model/link-props';
import { font } from '@weco/common/utils/classnames';
import { formatNumber } from '@weco/common/utils/grammar';
import Button, { ButtonTypes } from '@weco/common/views/components/Buttons';
import CheckboxRadio from '@weco/common/views/components/CheckboxRadio';
import Modal from '@weco/common/views/components/Modal';
import PlainList from '@weco/common/views/components/styled/PlainList';
import Space from '@weco/common/views/components/styled/Space';
import PaletteColorPicker from '@weco/content/components/PaletteColorPicker';
import { BooleanFilter } from '@weco/content/components/SearchFilters/SearchFilters.BooleanFilter';
import {
  CheckboxFilter as CheckboxFilterType,
  Filter,
  filterLabel,
  RadioFilter as RadioFilterType,
} from '@weco/content/services/wellcome/common/filters';
import { searchFilterCheckBox } from '@weco/content/text/aria-labels';

import DateRangeFilter from './SearchFilters.DateRangeFilter';

type ModalMoreFiltersProps = {
  id: string;
  isActive: boolean;
  setIsActive: (arg: boolean) => void;
  openMoreFiltersButtonRef: RefObject<HTMLInputElement>;
  changeHandler: () => void;
  resetFilters: LinkProps;
  filters: Filter[];
  form?: string;
  hasNoResults?: boolean;
};

type MoreFiltersProps = {
  filters: Filter[];
  changeHandler: () => void;
  form?: string;
  hasNoResults?: boolean;
};

const ModalInner = styled(Space).attrs({
  $v: { size: 'l', properties: ['padding-bottom'] },
})`
  position: relative;
  top: 15px;
  overflow-y: auto;
  max-height: 80vh;

  display: flex;
  flex-direction: column;
  min-width: 320px;
  max-width: 650px;

  ${props =>
    props.theme.media('medium')(`
      min-width: 420px;
  `)}

  ${props => props.theme.media('large')`
    width: 650px;
    top: 10px;
  `}
`;

// shared styles
const FilterSection = styled(Space).attrs({
  $h: { size: 'l', properties: ['padding-left', 'padding-right'] },
  $v: { size: 'l', properties: ['padding-top', 'padding-bottom'] },
})`
  border-bottom: 1px solid ${props => props.theme.color('warmNeutral.400')};
`;

const List = styled(PlainList)`
  display: flex;
  flex-wrap: wrap;

  > * {
    flex: 1 1 200px;
  }
`;

const FiltersFooter = styled(Space).attrs({
  $h: { size: 'l', properties: ['padding-left', 'padding-right'] },
  $v: { size: 'm', properties: ['padding-top', 'padding-bottom'] },
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
`;

const FiltersHeader = styled(Space).attrs({
  $h: { size: 'm', properties: ['padding-left', 'padding-right'] },
  $v: { size: 'm', properties: ['padding-top', 'padding-bottom'] },
})`
  position: absolute;
  background-color: ${props => props.theme.color('white')};
  border-bottom: 1px solid ${props => props.theme.color('warmNeutral.400')};
  text-align: center;
  top: 0;
  left: 0;
  width: 100%;

  > * {
    margin-bottom: 0;
  }
`;

type CheckboxFilterProps = {
  f: CheckboxFilterType;
  changeHandler: () => void;
  form?: string;
};
const CheckboxFilter = ({ f, changeHandler, form }: CheckboxFilterProps) => {
  return (
    <List>
      {f.options.map(({ id, label, value, count, selected }) => {
        return (
          <Space
            as="li"
            $v={{ size: 'm', properties: ['margin-bottom'] }}
            $h={{ size: 'l', properties: ['margin-right'] }}
            key={`desktop-${id}`}
          >
            <CheckboxRadio
              id={`desktop-${id}`}
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
    </List>
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
          <li key={`desktop-${id}`}>
            <CheckboxRadio
              id={`desktop-${id}`}
              type="radio"
              text={`${label} (${formatNumber(count || 0)})`} // Always show even if count is 0
              value={value}
              name={f.id}
              checked={selected}
              onChange={changeHandler}
              form={form}
              disabled={count === 0}
            />
          </li>
        );
      })}
    </PlainList>
  );
};

export const getFilterLabel = (type: Filter['type'], label: string) => {
  let filterTitle: string | undefined;

  switch (type) {
    case 'color':
      filterTitle = 'Colours';
      break;
    case 'boolean':
      break;
    default:
      filterTitle = label;
      break;
  }

  return filterTitle ? <h3 className={font('wb', 4)}>{filterTitle}</h3> : null;
};

const MoreFilters: FunctionComponent<MoreFiltersProps> = ({
  changeHandler,
  filters,
  form,
  hasNoResults,
}: MoreFiltersProps) => {
  return (
    <>
      {filters
        .filter(f => !f.excludeFromMoreFilters)
        .map(f => (
          <FilterSection key={f.id}>
            {getFilterLabel(f.type, f.label)}

            {(f.type !== 'checkbox' ||
              (f.type === 'checkbox' && f.options.length > 0)) && (
              <Space as="span" $h={{ size: 'm', properties: ['margin-right'] }}>
                <PlainList as="div">
                  <section aria-label={f.label}>
                    {f.type === 'checkbox' && (
                      <CheckboxFilter
                        f={f}
                        changeHandler={changeHandler}
                        form={form}
                      />
                    )}

                    {f.type === 'radio' && (
                      <RadioFilter
                        f={f}
                        changeHandler={changeHandler}
                        form={form}
                      />
                    )}

                    {f.type === 'dateRange' &&
                      !(hasNoResults && !(f.from.value || f.to.value)) && (
                        <DateRangeFilter
                          f={f}
                          changeHandler={changeHandler}
                          form={form}
                        />
                      )}

                    {f.type === 'color' && !(hasNoResults && !f.color) && (
                      <PaletteColorPicker
                        name={f.id}
                        color={f.color}
                        onChangeColor={changeHandler}
                        form={form}
                      />
                    )}

                    {f.type === 'boolean' &&
                      !(hasNoResults && !f.isSelected) && (
                        <BooleanFilter
                          f={f}
                          changeHandler={changeHandler}
                          form={form}
                        />
                      )}
                  </section>
                </PlainList>
              </Space>
            )}
          </FilterSection>
        ))}
    </>
  );
};

const ModalMoreFilters: FunctionComponent<ModalMoreFiltersProps> = ({
  id,
  isActive,
  setIsActive,
  openMoreFiltersButtonRef,
  changeHandler,
  resetFilters,
  filters,
  form,
  hasNoResults,
}: ModalMoreFiltersProps) => {
  const { isEnhanced } = useAppContext();

  return (
    <>
      <noscript>
        <MoreFilters
          changeHandler={changeHandler}
          filters={filters}
          hasNoResults={hasNoResults}
          form={form}
        />
        <button type={ButtonTypes.submit} form={form}>
          Submit
        </button>
      </noscript>

      {isEnhanced && (
        <Modal
          id={id}
          isActive={isActive}
          setIsActive={setIsActive}
          openButtonRef={openMoreFiltersButtonRef}
          modalStyle="filters"
        >
          <FiltersHeader>
            <h3 className={font('wb', 4)}>All filters</h3>
          </FiltersHeader>
          {/* The Modal element needs to be pre-rendered even if inactive for its CSSTransition effect
            But there's a bit of rerending withing MoreFilters that is causing issues with the Desktop behaviour,
            so hiding if not active. https://github.com/wellcomecollection/wellcomecollection.org/issues/10287#issuecomment-1857622262 */}
          {isActive && (
            <ModalInner>
              <MoreFilters
                changeHandler={changeHandler}
                filters={filters}
                form={form}
                hasNoResults={hasNoResults}
              />
            </ModalInner>
          )}
          <FiltersFooter>
            <NextLink passHref {...resetFilters}>
              Reset filters
            </NextLink>

            <Button
              variant="ButtonSolid"
              ref={undefined}
              type={ButtonTypes.button}
              clickHandler={() => {
                setIsActive(false);
              }}
              text="Show results"
            />
          </FiltersFooter>
        </Modal>
      )}
    </>
  );
};

export default ModalMoreFilters;
