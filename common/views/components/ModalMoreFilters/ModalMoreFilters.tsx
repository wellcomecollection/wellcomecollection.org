import React, { FunctionComponent, RefObject, useContext } from 'react';
import Modal from '../../components/Modal/Modal';
import styled from 'styled-components';
import Space from '../styled/Space';
import { searchFilterCheckBox } from '../../../text/aria-labels';
import NextLink from 'next/link';
import ButtonSolid, { ButtonTypes } from '../ButtonSolid/ButtonSolid';
import {
  Filter,
  CheckboxFilter as CheckboxFilterType,
  DateRangeFilter as DateRangeFilterType,
  ColorFilter as ColorFilterType,
  filterLabel,
} from '../../../services/catalogue/filters';
import { AppContext } from '../AppContext/AppContext';
import CheckboxRadio from '../CheckboxRadio/CheckboxRadio';
import PlainList from '../styled/PlainList';
import NumberInput from '../NumberInput/NumberInput';
import { dateRegex } from '../SearchFilters/SearchFiltersDesktop';
import { useControlledState } from '@weco/common/utils/useControlledState';
import PaletteColorPicker from '../PaletteColorPicker/PaletteColorPicker';
import { LinkProps } from '@weco/common/model/link-props';

type ModalMoreFiltersProps = {
  id: string;
  isActive: boolean;
  setIsActive: (arg: boolean) => void;
  openMoreFiltersButtonRef: RefObject<HTMLInputElement>;
  changeHandler: () => void;
  resetFilters: LinkProps;
  filters: Filter[];
  form?: string;
  isNewStyle?: boolean;
};

type MoreFiltersProps = {
  filters: Filter[];
  changeHandler: () => void;
  form?: string;
  isNewStyle?: boolean;
};

const ModalInner = styled(Space).attrs({
  v: { size: 'l', properties: ['padding-bottom'] },
})<{ isNewStyle?: boolean }>`
  display: flex;
  flex-direction: column;
  min-width: 320px;
  max-width: 650px;
  ${props => props.theme.media('large')`
    width: 650px;
    top: 10px;
  `}
  position: relative;
  top: ${props => (props.isNewStyle ? '0' : '15px')};
  overflow-y: auto;
  max-height: 80vh;
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
  v: { size: 'l', properties: ['padding-top', 'padding-bottom'] },
})<{ isNewStyle?: boolean }>`
  display: flex;
  align-items: center;
  justify-content: space-between;
  background-color: ${props => props.theme.color('white')};
  border-top: 1px solid ${props => props.theme.color('warmNeutral.400')};
  position: ${props => (props.isNewStyle ? 'relative' : 'fixed')};
  bottom: 0;
  left: 0;
  right: 0;
  height: 60px;
`;

const FiltersHeader = styled(Space).attrs({
  h: { size: 'm', properties: ['padding-left', 'padding-right'] },
  v: { size: 'm', properties: ['padding-top', 'padding-bottom'] },
})<{ isNewStyle?: boolean }>`
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
      {f.options.map(({ id, label, value, count, selected }) => {
        return (
          <Space
            as="li"
            v={{ size: 'm', properties: ['margin-bottom'] }}
            h={{ size: 'l', properties: ['margin-right'] }}
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

type DateRangeFilterProps = {
  f: DateRangeFilterType;
  changeHandler: () => void;
  form?: string;
  isNewStyle?: boolean;
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
  isNewStyle?: boolean;
};
const ColorFilter = ({ f, changeHandler, form }: ColorFilterProps) => {
  return (
    <PaletteColorPicker
      name={f.id}
      color={f.color}
      onChangeColor={changeHandler}
      form={form}
    />
  );
};

const MoreFilters: FunctionComponent<MoreFiltersProps> = ({
  changeHandler,
  filters,
  form,
  isNewStyle,
}: MoreFiltersProps) => {
  return (
    <>
      {!isNewStyle &&
        filters
          .filter(f => f.excludeFromMoreFilters)
          .map(f => (
            <div key={f.id} style={{ display: 'none' }}>
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
                <ColorFilter f={f} changeHandler={changeHandler} form={form} />
              )}
            </div>
          ))}
      {filters
        .filter(f => !f.excludeFromMoreFilters)
        .map(f => (
          <FilterSection key={f.id}>
            <h3 className="h3">{f.type === 'color' ? 'Colours' : f.label}</h3>
            <Space as="span" h={{ size: 'm', properties: ['margin-right'] }}>
              <div className="no-margin no-padding plain-list">
                <section aria-label={f.label}>
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
                    <ColorFilter
                      f={f}
                      changeHandler={changeHandler}
                      form={form}
                    />
                  )}
                </section>
              </div>
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
            form={form}
          />
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
          <h3 className="h3">{isNewStyle ? 'All Filters' : 'More filters'}</h3>
        </FiltersHeader>

        <ModalInner isNewStyle={isNewStyle}>
          {isEnhanced && (
            <MoreFilters
              changeHandler={changeHandler}
              filters={filters}
              form={form}
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
