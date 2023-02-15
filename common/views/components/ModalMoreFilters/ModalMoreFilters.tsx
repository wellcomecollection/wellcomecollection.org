import React, { FunctionComponent, RefObject, useContext } from 'react';
import NextLink from 'next/link';
import styled from 'styled-components';
import Modal from '@weco/common/views/components/Modal/Modal';
import Space from '@weco/common/views/components/styled/Space';
import { searchFilterCheckBox } from '@weco/common/text/aria-labels';
import ButtonSolid, {
  ButtonTypes,
} from '@weco/common/views/components/ButtonSolid/ButtonSolid';
import {
  Filter,
  CheckboxFilter as CheckboxFilterType,
  filterLabel,
} from '@weco/common/services/catalogue/filters';
import { AppContext } from '@weco/common/views/components/AppContext/AppContext';
import CheckboxRadio from '@weco/common/views/components/CheckboxRadio/CheckboxRadio';
import PlainList from '@weco/common/views/components/styled/PlainList';
import { LinkProps } from '@weco/common/model/link-props';
import DateRangeFilter from '@weco/common/views/components/SearchFilters/SearchFilters.DateRange';
import PaletteColorPicker from '@weco/common/views/components/PaletteColorPicker/PaletteColorPicker';

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
  isNewStyle?: boolean;
};

type MoreFiltersProps = {
  filters: Filter[];
  changeHandler: () => void;
  form?: string;
  hasNoResults?: boolean;
  isNewStyle?: boolean;
};

const ModalInner = styled(Space).attrs({
  v: { size: 'l', properties: ['padding-bottom'] },
})<{ isNewStyle?: boolean }>`
  display: flex;
  flex-direction: column;
  min-width: 320px;
  max-width: 650px;
  ${props =>
    props.theme.media('medium')(`
    min-width: ${props.isNewStyle ? '500px' : '320px'};
  `)}
  ${props => props.theme.media('large')`
    width: 650px;
    top: 10px;
  `}
  position: relative;
  top: ${props => (props.isNewStyle ? '0' : '15px')};
  overflow-y: auto;
  max-height: ${props => (props.isNewStyle ? 'none' : '80vh')};
`;

// shared styles
const FilterSection = styled(Space).attrs({
  h: { size: 'l', properties: ['padding-left', 'padding-right'] },
  v: { size: 'l', properties: ['padding-top', 'padding-bottom'] },
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
  h: { size: 'l', properties: ['padding-left', 'padding-right'] },
  v: { size: 'm', properties: ['padding-top', 'padding-bottom'] },
})<{ isNewStyle?: boolean }>`
  display: flex;
  align-items: center;
  justify-content: space-between;
  background-color: ${props => props.theme.color('white')};
  border-top: 1px solid ${props => props.theme.color('warmNeutral.400')};
  position: ${props => (props.isNewStyle ? 'sticky' : 'fixed')};
  bottom: 0;
  left: 0;
  right: 0;
`;

const FiltersHeader = styled(Space).attrs<{ isNewStyle?: boolean }>(props => ({
  h: { size: 'm', properties: ['padding-left', 'padding-right'] },
  v: {
    size: props.isNewStyle ? 's' : 'm',
    properties: ['padding-top', 'padding-bottom'],
  },
}))<{ isNewStyle?: boolean }>`
  position: ${props => (props.isNewStyle ? 'relative' : 'absolute')};
  background-color: ${props => props.theme.color('white')};
  border-bottom: 1px solid ${props => props.theme.color('warmNeutral.400')};
  text-align: center;
  top: 0px;
  left: 0px;
  width: 100%;
`;

type CheckboxFilterProps = {
  f: CheckboxFilterType;
  changeHandler: () => void;
  form?: string;
};
const CheckboxFilter = ({ f, changeHandler, form }: CheckboxFilterProps) => {
  return (
    <List>
      {f.options.map(({ id, label, value, count, selected }, i) => {
        return (
          <Space
            as="li"
            v={{ size: 'm', properties: ['margin-bottom'] }}
            h={{ size: 'l', properties: ['margin-right'] }}
            // TODO remove index from key once we resolve the doubled IDs issue
            // (https://github.com/wellcomecollection/wellcomecollection.org/issues/9109)
            // as we now sometimes get "Warning: Encountered two children with the same key" console errors
            key={`desktop-${f.id}-${i}`}
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

const MoreFilters: FunctionComponent<MoreFiltersProps> = ({
  changeHandler,
  filters,
  form,
  hasNoResults,
  isNewStyle,
}: MoreFiltersProps) => {
  return (
    <>
      {!isNewStyle &&
        filters
          .filter(f => f.excludeFromMoreFilters)
          .map((f, i) => (
            // TODO remove index from key once we resolve the doubled IDs issue
            // (https://github.com/wellcomecollection/wellcomecollection.org/issues/9109)
            // as we now sometimes get "Warning: Encountered two children with the same key" console errors
            <div key={`${f.id}-${i}`} style={{ display: 'none' }}>
              {f.type === 'checkbox' && (
                <CheckboxFilter
                  f={f}
                  changeHandler={changeHandler}
                  form={form}
                />
              )}
              {f.type === 'dateRange' && (
                <DateRangeFilter
                  f={f}
                  changeHandler={changeHandler}
                  form={form}
                />
              )}
              {f.type === 'color' && (
                <PaletteColorPicker
                  name={f.id}
                  color={f.color}
                  onChangeColor={changeHandler}
                  form={form}
                />
              )}
            </div>
          ))}
      {filters
        .filter(f => !f.excludeFromMoreFilters)
        .map((f, i) => (
          // TODO remove index from key once we resolve the doubled IDs issue
          // (https://github.com/wellcomecollection/wellcomecollection.org/issues/9109)
          // as we now sometimes get "Warning: Encountered two children with the same key" console errors
          <FilterSection key={`${f.id}-${i}`}>
            <h3 className="h3">{f.type === 'color' ? 'Colours' : f.label}</h3>
            <Space as="span" h={{ size: 'm', properties: ['margin-right'] }}>
              <PlainList as="div">
                <section aria-label={f.label}>
                  {f.type === 'checkbox' && (
                    <CheckboxFilter
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
                </section>
              </PlainList>
            </Space>
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
  isNewStyle,
}: ModalMoreFiltersProps) => {
  const { isEnhanced } = useContext(AppContext);

  return (
    <>
      <noscript>
        <>
          <MoreFilters
            changeHandler={changeHandler}
            filters={filters}
            hasNoResults={hasNoResults}
            form={form}
          />
          <button type={ButtonTypes.submit} form={form}>
            Submit
          </button>
        </>
      </noscript>
      <Modal
        id={id}
        isActive={isActive}
        setIsActive={setIsActive}
        openButtonRef={openMoreFiltersButtonRef}
        modalStyle={isNewStyle ? 'filters-new' : 'filters'}
      >
        <FiltersHeader isNewStyle={isNewStyle}>
          <h3 className="h3">{isNewStyle ? 'All filters' : 'More filters'}</h3>
        </FiltersHeader>

        <ModalInner isNewStyle={isNewStyle}>
          {isEnhanced && (
            <MoreFilters
              changeHandler={changeHandler}
              filters={filters}
              form={form}
              hasNoResults={hasNoResults}
              isNewStyle={isNewStyle}
            />
          )}
        </ModalInner>
        <FiltersFooter isNewStyle={isNewStyle}>
          <NextLink passHref {...resetFilters}>
            <a>Reset filters</a>
          </NextLink>

          <ButtonSolid
            ref={undefined}
            type={ButtonTypes.button}
            clickHandler={() => {
              setIsActive(false);
            }}
            text="Show results"
          />
        </FiltersFooter>
      </Modal>
    </>
  );
};

export default ModalMoreFilters;
